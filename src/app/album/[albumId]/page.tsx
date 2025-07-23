// app/album/[albumId]/page.tsx

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import Header from '@/app/components/Header'
import { PhotoGrid } from './components/PhotoGrid'
import { getAlbumDetails, getPhotos, setInitialCover } from '@/lib/album-actions'

export default async function AlbumPage({ params }: { params: Promise<{ albumId: string }> }) {
	const session = await getServerSession(authOptions)
	if (!session?.user?.email) {
		redirect('/')
	}

	const { albumId } = await params

	const [albumDetails, photos] = await Promise.all([getAlbumDetails(albumId), getPhotos(albumId)])

	//const displayAlbumName = albumDetails.name.replace(/^\d{4}-\d{2}-\d{2}\s/, '')

	const hasCover = photos.some(p => p.name.includes('_cover'))

	if (!hasCover && photos.length > 0) {
		try {
			const firstImage = photos.find(p => !('videoMediaMetadata' in p))

			if (firstImage) {
				const result = await setInitialCover(albumId, firstImage.id)

				const photoToUpdate = photos.find(p => p.id === firstImage.id)
				if (photoToUpdate) {
					photoToUpdate.name = result.newName
				}
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

				<PhotoGrid photos={photos} folderId={albumId} />
			</main>
		</div>
	)
}
