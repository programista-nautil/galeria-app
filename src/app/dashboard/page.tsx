// app/dashboard/page.tsx

import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from '@/app/components/AuthButton'
import { google } from 'googleapis'
import Header from '../components/Header'

interface Album {
	id: string
	name: string
	coverImageThumbnail?: string | null
}

async function getAlbums(accessToken: string): Promise<Album[]> {
	const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)
	oauth2Client.setCredentials({ access_token: accessToken })

	const drive = google.drive({ version: 'v3', auth: oauth2Client })

	const parentFolderResponse = await drive.files.list({
		q: "mimeType='application/vnd.google-apps.folder' and name='Galeria Zdjęć' and 'root' in parents and trashed=false",
		fields: 'files(id)',
		pageSize: 1,
	})

	const parentFolder = parentFolderResponse.data.files?.[0]

	if (!parentFolder?.id) {
		console.log("Folder 'Galeria Zdjęć' not found in the root directory.")
		return []
	}
	const parentFolderId = parentFolder.id

	const foldersResponse = await drive.files.list({
		q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
		fields: 'files(id, name)',
		orderBy: 'name desc',
	})

	const folders = foldersResponse.data.files
	if (!folders || folders.length === 0) return []

	const albumsWithCovers = await Promise.all(
		folders.map(async folder => {
			let currentFolderName = folder.name!

			const correctDateRegex = /^\d{4}-\d{2}-\d{2} /
			const oldIncorrectDateRegex = /^(\d{4}-\d{2}-\d{2})\s*[-–—]\s*/

			if (correctDateRegex.test(currentFolderName)) {
			} else if (oldIncorrectDateRegex.test(currentFolderName)) {
				const newFolderName = currentFolderName.replace(' - ', ' ')
				await drive.files.update({
					fileId: folder.id!,
					requestBody: { name: newFolderName },
				})
				currentFolderName = newFolderName
			} else {
				const oldestPhotoResponse = await drive.files.list({
					q: `'${folder.id}' in parents and mimeType contains 'image/' and trashed=false`,
					fields: 'files(createdTime)',
					orderBy: 'createdTime asc',
					pageSize: 1,
				})

				const oldestPhoto = oldestPhotoResponse.data.files?.[0]

				if (oldestPhoto?.createdTime) {
					const date = new Date(oldestPhoto.createdTime)
					const formattedDate = date.toISOString().split('T')[0]
					const newFolderName = `${formattedDate} ${currentFolderName}`
					await drive.files.update({
						fileId: folder.id!,
						requestBody: { name: newFolderName },
					})
					currentFolderName = newFolderName
				}
			}

			const imagesResponse = await drive.files.list({
				q: `'${folder.id}' in parents and mimeType contains 'image/' and trashed=false`,
				fields: 'files(thumbnailLink)',
				pageSize: 1,
			})

			return {
				id: folder.id!,
				name: currentFolderName,
				coverImageThumbnail: imagesResponse.data.files?.[0]?.thumbnailLink,
			}
		})
	)

	return albumsWithCovers
}

const AlbumCardPlaceholder = () => (
	<div className='aspect-[4/3] w-full bg-slate-200 rounded-xl flex items-center justify-center'>
		<svg
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'
			strokeWidth={1.5}
			stroke='currentColor'
			className='w-12 h-12 text-slate-400'>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm16.5-1.5H3.75V6h16.5v12Z'
			/>
		</svg>
	</div>
)

export default async function DashboardPage() {
	const session = await getServerSession(authOptions)

	if (!session || !session.user.accessToken) {
		redirect('/')
	}

	const albums = await getAlbums(session.user.accessToken)

	return (
		<div className='min-h-screen bg-white'>
			<Header />
			<main className='max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8'>
				{albums && albums.length > 0 ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
						{albums.map(album => {
							const displayName = album.name.replace(/^\d{4}-\d{2}-\d{2} /, '')

							return (
								<Link href={`/album/${album.id}`} key={album.id} className='group relative block'>
									<div className='aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-200 shadow-lg'>
										{album.coverImageThumbnail ? (
											<img
												src={album.coverImageThumbnail}
												alt={`Okładka albumu ${displayName}`} // Używamy czystej nazwy w atrybucie alt
												className='w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110'
											/>
										) : (
											<AlbumCardPlaceholder />
										)}
									</div>
									<div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none rounded-b-xl' />
									<h3 className='absolute bottom-4 left-4 text-white text-lg font-semibold drop-shadow-md'>
										{displayName}
									</h3>
								</Link>
							)
						})}
					</div>
				) : (
					<div className='text-center py-20'>
						<h3 className='text-2xl font-semibold text-slate-800'>Witaj w Twojej galerii!</h3>
						<p className='text-slate-500 mt-2'>
							Wygląda na to, że nie masz jeszcze żadnych albumów. Utwórz folder ze zdjęciami na Dysku Google.
						</p>
					</div>
				)}
			</main>
		</div>
	)
}
