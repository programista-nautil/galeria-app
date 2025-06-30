// src/lib/background-tasks.ts

import { google } from 'googleapis'
import sharp from 'sharp'
import { Readable } from 'stream'

async function streamToBuffer(stream: Readable): Promise<Buffer> {
	const chunks: Buffer[] = []
	for await (const chunk of stream) {
		chunks.push(chunk)
	}
	return Buffer.concat(chunks)
}

export async function startBackgroundCompression(albumId: string, refreshToken: string) {
	console.log(`BACKGROUND: Starting compression for album ID: ${albumId}`)

	try {
		const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)
		oauth2Client.setCredentials({ refresh_token: refreshToken })
		const drive = google.drive({ version: 'v3', auth: oauth2Client })

		const photosToCompressRes = await drive.files.list({
			q: `'${albumId}' in parents and mimeType contains 'image/' and trashed=false and not name contains '_compressed'`,
			fields: 'files(id, name)',
		})
		const photosToCompress = photosToCompressRes.data.files

		if (!photosToCompress || photosToCompress.length === 0) {
			console.log(`BACKGROUND: No photos to compress in album ${albumId}.`)
			return
		}

		console.log(`BACKGROUND: Found ${photosToCompress.length} photos to compress.`)

		// 3. Kompresuj każde zdjęcie po kolei
		for (const photo of photosToCompress) {
			const { id: fileId, name: fileName } = photo
			if (!fileId || !fileName) continue

			const photoStreamRes = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' })

			const imageBuffer = await streamToBuffer(photoStreamRes.data as Readable)

			const compressedBuffer = await sharp(imageBuffer)
				.resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
				.jpeg({ quality: 80, progressive: true })
				.toBuffer()

			const extensionIndex = fileName.lastIndexOf('.')
			const name = fileName.substring(0, extensionIndex).replace(/_compressed/g, '')
			const extension = fileName.substring(extensionIndex)
			const newFileName = `${name}_compressed${extension}`

			await drive.files.update({
				fileId: fileId,
				requestBody: { name: newFileName },
				media: {
					mimeType: 'image/jpeg',
					body: Readable.from(compressedBuffer),
				},
			})
			console.log(`BACKGROUND: Compressed photo ${fileName} -> ${newFileName}`)
		}

		console.log(`BACKGROUND: Finished compression for album ID: ${albumId}`)
	} catch (error) {
		console.error(`BACKGROUND COMPRESSION FAILED for album ${albumId}:`, error)
	}
}
