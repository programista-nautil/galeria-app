// src/app/api/uncompressed-photos/route.ts

import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { getDriveClient } from '@/lib/drive'

export async function GET(request: Request) {
	const session = await getServerSession(authOptions)
	if (!session?.user?.email) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { searchParams } = new URL(request.url)
	const folderId = searchParams.get('folderId')

	if (!folderId) {
		return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 })
	}

	const drive = getDriveClient()

	try {
		const response = await drive.files.list({
			q: `'${folderId}' in parents and mimeType contains 'image/' and trashed=false and not name contains '_compressed'`,
			fields: 'files(id, name)',
		})
		return NextResponse.json(response.data.files || [])
	} catch (error) {
		console.error('Failed to get uncompressed photos list:', error)
		return NextResponse.json({ error: 'Failed to get photo list' }, { status: 500 })
	}
}
