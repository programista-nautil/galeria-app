import { google } from 'googleapis'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(request: Request) {
	const session = await getServerSession(authOptions)

	if (!session?.user?.accessToken) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { searchParams } = new URL(request.url)
	const folderId = searchParams.get('folderId')

	if (!folderId) {
		return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 })
	}

	const oauth2Client = new google.auth.OAuth2()
	oauth2Client.setCredentials({ access_token: session.user.accessToken })

	const drive = google.drive({ version: 'v3', auth: oauth2Client })

	try {
		const response = await drive.files.list({
			q: `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`,
			fields: 'files(id, name, thumbnailLink, webContentLink, imageMediaMetadata(width, height))',
			pageSize: 1000,
		})

		return NextResponse.json(response.data.files)
	} catch (error) {
		console.error('Failed to fetch photos:', error)
		return NextResponse.json({ error: 'Failed to fetch photos from album' }, { status: 500 })
	}
}
