// app/album/[albumId]/page.tsx

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { google } from 'googleapis'
import Link from 'next/link'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Header from '@/app/components/Header'
import { PhotoGrid } from './components/PhotoGrid'

interface Photo {
	id: string
	name: string
	thumbnailLink?: string | null
}

interface Album {
	name: string
}

async function getAlbumDetails(accessToken: string, albumId: string): Promise<Album> {
	const oauth2Client = new google.auth.OAuth2()
	oauth2Client.setCredentials({ access_token: accessToken })
	const drive = google.drive({ version: 'v3', auth: oauth2Client })
	const response = await drive.files.get({
		fileId: albumId,
		fields: 'name',
	})
	return response.data as Album
}

async function getPhotos(accessToken: string, albumId: string): Promise<Photo[]> {
	const oauth2Client = new google.auth.OAuth2()
	oauth2Client.setCredentials({ access_token: accessToken })
	const drive = google.drive({ version: 'v3', auth: oauth2Client })
	const response = await drive.files.list({
		q: `'${albumId}' in parents and mimeType contains 'image/' and trashed=false`,
		fields: 'files(id, name, thumbnailLink)',
		pageSize: 1000,
	})
	return response.data.files as Photo[]
}

export default async function AlbumPage({ params }: { params: { albumId: string } }) {
	const session = await getServerSession(authOptions)
	if (!session?.user?.accessToken) {
		redirect('/')
	}

	const [albumDetails, photos] = await Promise.all([
		getAlbumDetails(session.user.accessToken, params.albumId),
		getPhotos(session.user.accessToken, params.albumId),
	])

	return (
		<div className='min-h-screen bg-white'>
			<Header />
			<main className='max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8'>
				<div className='mb-8'>
					<Link href='/dashboard' className='text-sm text-blue-600 hover:underline'>
						&larr; Wróć do albumów
					</Link>
					<h1 className='text-3xl font-bold tracking-tight text-slate-900 mt-2'>{albumDetails.name}</h1>
				</div>

				<PhotoGrid photos={photos} folderId={params.albumId} />
			</main>
		</div>
	)
}
