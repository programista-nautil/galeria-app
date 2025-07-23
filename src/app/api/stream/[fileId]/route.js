// src/app/api/stream/[fileId]/route.js

import { NextRequest, NextResponse } from 'next/server'
import { getDriveClient } from '@/lib/drive'

export async function GET(request, { params }) {
	const { fileId } = params
	if (!fileId) {
		return new Response('File ID is required', { status: 400 })
	}

	try {
		const drive = getDriveClient()

		// Pobieramy plik z Google Drive jako strumień
		const response = await drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'stream' })

		// Przesyłamy strumień bezpośrednio do przeglądarki
		const { data: stream } = response

		// Używamy ReadableStream, aby poprawnie przesłać dane
		const readableStream = new ReadableStream({
			start(controller) {
				stream.on('data', chunk => {
					controller.enqueue(chunk)
				})
				stream.on('end', () => {
					controller.close()
				})
				stream.on('error', err => {
					controller.error(err)
				})
			},
		})

		return new Response(readableStream, {
			headers: {
				'Content-Type': response.headers['content-type'] || 'video/mp4',
			},
		})
	} catch (error) {
		console.error(`Failed to stream file ${fileId}:`, error)
		return new Response('Error streaming file', { status: 500 })
	}
}
