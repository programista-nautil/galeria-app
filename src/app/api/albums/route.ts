// app/api/albums/route.ts

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { google } from 'googleapis'
import { NextResponse } from 'next/server'

export async function GET() {
	const session = await getServerSession(authOptions)

	if (!session || !session.user.accessToken) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const drive = google.drive({
			version: 'v3',
			auth: session.user.accessToken,
		})

		const response = await drive.files.list({
			q: "mimeType='application/vnd.google-apps.folder' and trashed=false",

			fields: 'files(id, name)',
		})

		return NextResponse.json(response.data.files)
	} catch (error) {
		console.error('Failed to fetch albums:', error)
		return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 })
	}
}
