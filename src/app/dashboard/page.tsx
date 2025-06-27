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
	const oauth2Client = new google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
		`${process.env.NEXTAUTH_URL}/api/auth/callback/google`
	)

	oauth2Client.setCredentials({
		access_token: accessToken,
	})

	const drive = google.drive({ version: 'v3', auth: oauth2Client })

	const foldersResponse = await drive.files.list({
		q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
		fields: 'files(id, name)',
		orderBy: 'name',
	})

	const folders = foldersResponse.data.files
	if (!folders) return []

	const albumsWithCovers = await Promise.all(
		folders.map(async folder => {
			const imagesResponse = await drive.files.list({
				q: `'${folder.id}' in parents and mimeType contains 'image/' and trashed=false`,
				fields: 'files(thumbnailLink)',
				pageSize: 1,
			})

			return {
				id: folder.id!,
				name: folder.name!,
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
						{albums.map(album => (
							<Link href={`/album/${album.id}`} key={album.id} className='group relative block'>
								<div className='aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-200 shadow-lg'>
									{album.coverImageThumbnail ? (
										<img
											src={album.coverImageThumbnail}
											alt={`Okładka albumu ${album.name}`}
											className='w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110'
										/>
									) : (
										<AlbumCardPlaceholder />
									)}
								</div>
								<div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none rounded-b-xl' />
								<h3 className='absolute bottom-4 left-4 text-white text-lg font-semibold drop-shadow-md'>
									{album.name}
								</h3>
							</Link>
						))}
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
