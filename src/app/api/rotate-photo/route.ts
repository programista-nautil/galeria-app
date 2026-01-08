import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import sharp from 'sharp'
import { Readable } from 'stream'
import { getDriveClient } from '@/lib/drive'

async function streamToBuffer(stream: Readable): Promise<Buffer> {
	const chunks: Buffer[] = []
	for await (const chunk of stream) {
		chunks.push(chunk)
	}
	return Buffer.concat(chunks)
}

export async function POST(request: Request) {
	const session = await getServerSession(authOptions)
	if (!session?.user?.email) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { fileId } = await request.json()
	if (!fileId) {
		return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
	}

	const drive = getDriveClient()

	try {
		// 1. Pobierz plik
		const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' })
		const imageBuffer = await streamToBuffer(response.data as Readable)

		// 2. Obróć o 90 stopni w prawo
		const rotatedBuffer = await sharp(imageBuffer).rotate(90).toBuffer()

		// 3. Nadpisz plik w Google Drive
		await drive.files.update({
			fileId: fileId,
			media: {
				mimeType: 'image/jpeg',
				body: Readable.from(rotatedBuffer),
			},
		})

		return NextResponse.json({ success: true, message: 'Photo rotated successfully' })
	} catch (error) {
		console.error(`Failed to rotate photo ${fileId}:`, error)
		return NextResponse.json({ error: `Failed to rotate photo` }, { status: 500 })
	}
}
