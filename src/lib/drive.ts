// src/lib/drive.ts

import { google, drive_v3 } from 'googleapis'
import path from 'path'
import { clientFolderMapping } from './permissions'

export function getDriveClient() {
	const auth = new google.auth.GoogleAuth({
		keyFile: path.join(process.cwd(), 'google-credentials.json'),
		scopes: ['https://www.googleapis.com/auth/drive'],
	})

	const drive = google.drive({ version: 'v3', auth })
	return drive
}

export async function findClientFolderId(drive: drive_v3.Drive, userEmail: string): Promise<string | null> {
	const clientFolderName = clientFolderMapping[userEmail]
	if (!clientFolderName) {
		console.log(`No folder mapping for user: ${userEmail}`)
		return null
	}

	const mainFolderRes = await drive.files.list({
		q: "mimeType='application/vnd.google-apps.folder' and name='Galeria Klientów'",
		fields: 'files(id)',
		pageSize: 1,
	})
	const mainFolderId = mainFolderRes.data.files?.[0]?.id
	if (!mainFolderId) {
		console.error("Main folder 'Galeria Klientów' not found.")
		return null
	}

	const clientFolderRes = await drive.files.list({
		q: `mimeType='application/vnd.google-apps.folder' and name='${clientFolderName}' and '${mainFolderId}' in parents and trashed=false`,
		fields: 'files(id)',
		pageSize: 1,
	})
	const clientFolderId = clientFolderRes.data.files?.[0]?.id
	if (!clientFolderId) {
		console.error(`Client folder '${clientFolderName}' not found for user ${userEmail}`)
		return null
	}

	return clientFolderId
}
