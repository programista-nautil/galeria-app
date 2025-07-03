// src/app/api/set-cover/route.ts

import { google } from 'googleapis'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { authOptions } from '../auth/[...nextauth]/route'
import { getDriveClient } from '@/lib/drive'

export async function POST(request: Request) {
	const session = await getServerSession(authOptions)
	if (!session?.user?.email) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { fileId, folderId } = await request.json()

	if (!fileId || !folderId) {
		return NextResponse.json({ error: 'File ID and Folder ID are required' }, { status: 400 })
	}

	const drive = getDriveClient()

	try {
		const oldCoverRes = await drive.files.list({
			q: `'${folderId}' in parents and name contains '_cover'`,
			fields: 'files(id, name)',
		})

		if (oldCoverRes.data.files && oldCoverRes.data.files.length > 0) {
			for (const oldCover of oldCoverRes.data.files) {
				if (oldCover.id && oldCover.name) {
					const newName = oldCover.name.replace(/_cover/g, '')
					await drive.files.update({ fileId: oldCover.id, requestBody: { name: newName } })
				}
			}
		}

		const fileRes = await drive.files.get({ fileId: fileId, fields: 'name' })
		const originalName = fileRes.data.name
		if (!originalName) throw new Error('Could not get file name')

		const nameWithoutCover = originalName.replace(/_cover/g, '')
		const extensionIndex = nameWithoutCover.lastIndexOf('.')
		let coverName: string

		if (extensionIndex !== -1) {
			const name = nameWithoutCover.substring(0, extensionIndex)
			const extension = nameWithoutCover.substring(extensionIndex)
			coverName = `${name}_cover${extension}`
		} else {
			coverName = `${nameWithoutCover}_cover`
		}

		await drive.files.update({
			fileId: fileId,
			requestBody: { name: coverName },
		})

		revalidatePath('/dashboard')
		revalidatePath(`/album/${folderId}`)

		return NextResponse.json({ success: true, newName: coverName })
	} catch (error) {
		console.error('Failed to set cover:', error)
		return NextResponse.json({ error: 'Failed to set cover' }, { status: 500 })
	}
}
