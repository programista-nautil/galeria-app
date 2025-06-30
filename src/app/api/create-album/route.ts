// src/app/api/create-album/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { google } from 'googleapis'
import { revalidatePath } from 'next/cache'
import { Readable } from 'stream'
import { startBackgroundCompression } from '@/lib/background-tasks'

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions)
	if (!session?.user?.accessToken || !session.user.refreshToken) {
		return NextResponse.json({ error: 'Unauthorized or refresh token missing' }, { status: 401 })
	}

	try {
		const formData = await req.formData()

		const title = formData.get('title') as string
		const photos = formData.getAll('photos') as File[]

		if (!title || !photos || photos.length === 0) {
			return NextResponse.json({ error: 'Tytuł i zdjęcia są wymagane' }, { status: 400 })
		}

		const oauth2Client = new google.auth.OAuth2()
		oauth2Client.setCredentials({ access_token: session.user.accessToken })
		const drive = google.drive({ version: 'v3', auth: oauth2Client })

		const parentFolderResponse = await drive.files.list({
			q: "mimeType='application/vnd.google-apps.folder' and name='Galeria Zdjęć' and 'root' in parents and trashed=false",
			fields: 'files(id)',
			pageSize: 1,
		})
		const parentFolderId = parentFolderResponse.data.files?.[0]?.id
		if (!parentFolderId) {
			throw new Error("Folder 'Galeria Zdjęć' nie został znaleziony.")
		}

		const formattedDate = new Date().toISOString().split('T')[0]
		const newFolderName = `${formattedDate} ${title}`

		const folderMetadata = {
			name: newFolderName,
			mimeType: 'application/vnd.google-apps.folder',
			parents: [parentFolderId],
		}
		const newFolder = await drive.files.create({
			requestBody: folderMetadata,
			fields: 'id',
		})
		const newFolderId = newFolder.data.id
		if (!newFolderId) {
			throw new Error('Nie udało się stworzyć nowego folderu albumu.')
		}

		await Promise.all(
			photos.map(async photo => {
				const photoBuffer = Buffer.from(await photo.arrayBuffer())
				const photoStream = Readable.from(photoBuffer)

				const photoMetadata = {
					name: photo.name || 'unnamed-photo.jpg',
					parents: [newFolderId],
				}
				const media = {
					mimeType: photo.type || 'image/jpeg',
					body: photoStream,
				}

				return drive.files.create({
					requestBody: photoMetadata,
					media: media,
					fields: 'id',
				})
			})
		)

		revalidatePath('/dashboard')

		startBackgroundCompression(newFolderId, session.user.refreshToken)

		return NextResponse.json({ success: true, uploadedFilesCount: photos.length })
	} catch (error: any) {
		console.error('Error creating album:', error)
		return NextResponse.json({ error: error.message || 'Wystąpił błąd serwera.' }, { status: 500 })
	}
}
