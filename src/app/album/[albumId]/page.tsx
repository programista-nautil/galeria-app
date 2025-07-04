// app/album/[albumId]/page.tsx

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { google } from 'googleapis'
import Link from 'next/link'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Header from '@/app/components/Header'
import { PhotoGrid } from './components/PhotoGrid'
import { getDriveClient } from '@/lib/drive'

interface Photo {
	id: string
	name: string
	thumbnailLink?: string | null
}

interface Album {
	name: string
}

async function setInitialCover(folderId: string, fileId: string): Promise<{ newName: string }> {
	const drive = getDriveClient()

	const fileRes = await drive.files.get({ fileId: fileId, fields: 'name' })
	const originalName = fileRes.data.name
	if (!originalName) throw new Error('Could not get file name')

	const nameWithoutCover = originalName.replace(/_cover/g, '')
	const extensionIndex = nameWithoutCover.lastIndexOf('.')
	let coverName: string

	if (extensionIndex !== -1) {
		const name = nameWithoutCover.substring(0, extensionIndex)
		const extension = nameWithoutCover.substring(extensionIndex)
		coverName = `${name}_cover${extension}`
	} else {
		coverName = `${nameWithoutCover}_cover`
	}

	await drive.files.update({
		fileId: fileId,
		requestBody: { name: coverName },
	})

	return { newName: coverName }
}

async function getAlbumDetails(albumId: string): Promise<Album> {
	const drive = getDriveClient()
	const response = await drive.files.get({
		fileId: albumId,
		fields: 'name',
	})
	return response.data as Album
}

async function getPhotos(albumId: string): Promise<Photo[]> {
	const drive = getDriveClient()
	const response = await drive.files.list({
		q: `'${albumId}' in parents and mimeType contains 'image/' and trashed=false`,
		fields: 'files(id, name, thumbnailLink)',
		pageSize: 1000,
	})

	return (response.data.files as Photo[]) || []
}

export default async function AlbumPage({ params }: { params: { albumId: string } }) {
	const session = await getServerSession(authOptions)
	if (!session?.user?.email) {
		redirect('/')
	}

	let [albumDetails, photos] = await Promise.all([getAlbumDetails(params.albumId), getPhotos(params.albumId)])

	const displayAlbumName = albumDetails.name.replace(/^\d{4}-\d{2}-\d{2}\s/, '')

	const hasCover = photos.some(p => p.name.includes('_cover'))

	if (!hasCover && photos.length > 0) {
		try {
			const result = await setInitialCover(params.albumId, photos[0].id)

			const photoToUpdate = photos.find(p => p.id === photos[0].id)
			if (photoToUpdate) {
				photoToUpdate.name = result.newName
			}
		} catch (error) {
			console.error('Failed to auto-set cover on initial load:', error)
		}
	}

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
