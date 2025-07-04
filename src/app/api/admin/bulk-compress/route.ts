import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { getDriveClient, findClientFolderId } from '@/lib/drive'
import { startBackgroundCompression } from '@/lib/background-tasks'

export async function POST() {
	const session = await getServerSession(authOptions)
	if (!session?.user?.email) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const drive = getDriveClient()

		// =========ZMIANA: Znajdujemy folder klienta=========
		const clientFolderId = await findClientFolderId(drive, session.user.email)
		if (!clientFolderId) {
			throw new Error(`Nie znaleziono folderu dla klienta: ${session.user.email}`)
		}

		// Pobierz ID wszystkich podfolderów (albumów) z folderu klienta
		const foldersResponse = await drive.files.list({
			q: `'${clientFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
			fields: 'files(id)',
		})
		const albums = foldersResponse.data.files

		if (!albums || albums.length === 0) {
			return NextResponse.json({ message: 'Ten klient nie ma żadnych albumów do przetworzenia.' })
		}

		// Dla każdego albumu klienta, uruchom zadanie kompresji w tle
		for (const album of albums) {
			if (album.id) {
				startBackgroundCompression(album.id)
			}
		}

		const message = `Zlecono kompresję w tle dla ${albums.length} albumów klienta ${session.user.email}.`
		return NextResponse.json({ success: true, message })
	} catch (error: unknown) {
		console.error('Error starting bulk compression:', error)

		let errorMessage = 'Wystąpił nieznany błąd serwera.'
		if (error instanceof Error) {
			errorMessage = error.message
		}

		return NextResponse.json({ error: errorMessage }, { status: 500 })
	}
}
