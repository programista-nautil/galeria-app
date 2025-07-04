// src/app/api/create-album/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { Readable } from 'stream'
import { startBackgroundCompression } from '@/lib/background-tasks'
import { getDriveClient, findClientFolderId } from '@/lib/drive'

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions)
	if (!session?.user?.email) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const formData = await req.formData()

		const title = formData.get('title') as string
		const photos = formData.getAll('photos') as File[]

		if (!title || !photos || photos.length === 0) {
			return NextResponse.json({ error: 'Tytuł i zdjęcia są wymagane' }, { status: 400 })
		}

		const drive = getDriveClient()

		const parentFolderId = await findClientFolderId(drive, session.user.email)
		if (!parentFolderId) {
			throw new Error(`Nie można utworzyć albumu, ponieważ nie znaleziono folderu dla klienta: ${session.user.email}`)
		}

		const formattedDate = new Date().toISOString().split('T')[0]
		const newFolderName = `${formattedDate} ${title}`

		const folderMetadata = {
			name: newFolderName,
			mimeType: 'application/vnd.google-apps.folder',
			parents: [parentFolderId], // Używamy znalezionego ID folderu klienta
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

		startBackgroundCompression(newFolderId)

		return NextResponse.json({ success: true, uploadedFilesCount: photos.length })
	} catch (error: unknown) {
		let errorMessage = 'Wystąpił nieznany błąd serwera.'
		if (error instanceof Error) {
			errorMessage = error.message
		}

		return NextResponse.json({ error: errorMessage }, { status: 500 })
	}
}
