// src/app/api/compress-photo/route.ts
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'
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

	const { fileId, fileName } = await request.json()
	if (!fileId || !fileName) {
		return NextResponse.json({ error: 'File ID and File Name are required' }, { status: 400 })
	}

	const drive = getDriveClient()

	try {
		const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' })

		const imageBuffer = await streamToBuffer(response.data as Readable)

		const compressedBuffer = await sharp(imageBuffer)
			.resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
			.jpeg({ quality: 80, progressive: true })
			.toBuffer()

		const extensionIndex = fileName.lastIndexOf('.')
		let newFileName: string
		if (extensionIndex !== -1) {
			const name = fileName.substring(0, extensionIndex).replace(/_compressed/g, '') // Usuwamy stary sufix na wszelki wypadek
			const extension = fileName.substring(extensionIndex)
			newFileName = `${name}_compressed${extension}`
		} else {
			newFileName = `${fileName.replace(/_compressed/g, '')}_compressed`
		}

		await drive.files.update({
			fileId: fileId,
			requestBody: { name: newFileName },
			media: {
				mimeType: 'image/jpeg',
				body: Readable.from(compressedBuffer),
			},
		})

		return NextResponse.json({ success: true, fileId, newName: newFileName })
	} catch (error) {
		console.error(`Failed to compress photo ${fileId}:`, error)
		return NextResponse.json({ error: `Failed to compress photo ${fileId}` }, { status: 500 })
	}
}
