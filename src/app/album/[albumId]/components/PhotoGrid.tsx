'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface Photo {
	id: string
	name: string
	thumbnailLink?: string | null
	videoMediaMetadata?: object
}

const PlayIcon = () => (
	<div className='absolute inset-0 flex items-center justify-center bg-black/20'>
		<svg className='w-12 h-12 text-white/80' fill='currentColor' viewBox='0 0 20 20'>
			<path
				fillRule='evenodd'
				d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
				clipRule='evenodd'></path>
		</svg>
	</div>
)

export function PhotoGrid({ photos, folderId }: { photos: Photo[]; folderId: string }) {
	const [isSettingCover, setIsSettingCover] = useState(false)
	const [isLoading, setIsLoading] = useState<string | null>(null)

	const initialCoverId = photos.find(p => p.name.includes('_cover'))?.id

	const [currentCoverId, setCurrentCoverId] = useState<string | undefined>(initialCoverId)

	const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)

	//const [isCompressing, setIsCompressing] = useState(false)
	//const [compressionProgress, setCompressionProgress] = useState({ current: 0, total: 0 })

	const handleOpenModal = (index: number) => {
		setSelectedPhotoIndex(index)
	}

	const handleCloseModal = () => {
		setSelectedPhotoIndex(null)
	}

	const handleNextPhoto = useCallback(() => {
		if (selectedPhotoIndex === null) return
		setSelectedPhotoIndex(prevIndex => (prevIndex! + 1) % photos.length)
	}, [selectedPhotoIndex, photos.length])

	const handlePrevPhoto = useCallback(() => {
		if (selectedPhotoIndex === null) return
		setSelectedPhotoIndex(prevIndex => (prevIndex! - 1 + photos.length) % photos.length)
	}, [selectedPhotoIndex, photos.length])

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (selectedPhotoIndex === null) return

			if (e.key === 'Escape') {
				handleCloseModal()
			} else if (e.key === 'ArrowRight') {
				handleNextPhoto()
			} else if (e.key === 'ArrowLeft') {
				handlePrevPhoto()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [selectedPhotoIndex, handleNextPhoto, handlePrevPhoto])

	useEffect(() => {
		const cover = photos.find(p => p.name.includes('_cover'))
		setCurrentCoverId(cover?.id)
	}, [photos])

	const handleSetCover = async (fileId: string) => {
		const previousCoverId = currentCoverId
		setIsLoading(fileId)
		setCurrentCoverId(fileId)

		try {
			const response = await fetch('/api/set-cover', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fileId, folderId }),
			})

			if (!response.ok) {
				throw new Error('Failed to set cover')
			}

			toast.success(`Ustawiono nową okładkę dla albumu!`)
			setIsSettingCover(false)
		} catch (error: unknown) {
			console.error(error)
			toast.error('Wystąpił błąd podczas ustawiania okładki.')
			setCurrentCoverId(previousCoverId)
		} finally {
			setIsLoading(null)
		}
	}

	// const handleStartCompression = async () => {
	// 	setIsCompressing(true)
	// 	setCompressionProgress({ current: 0, total: 0 })
	// 	toast.info('Pobieranie listy zdjęć do kompresji...')

	// 	try {
	// 		const res = await fetch(`/api/uncompressed-photos?folderId=${folderId}`)
	// 		if (!res.ok) throw new Error('Błąd serwera przy pobieraniu listy zdjęć.')
	// 		const photosToCompress = await res.json()

	// 		if (photosToCompress.length === 0) {
	// 			toast.success('Wszystkie zdjęcia w tym albumie są już skompresowane!')
	// 			setIsCompressing(false)
	// 			return
	// 		}

	// 		setCompressionProgress({ current: 0, total: photosToCompress.length })
	// 		toast.info(`Rozpoczynanie kompresji ${photosToCompress.length} zdjęć.`)

	// 		for (const photo of photosToCompress) {
	// 			try {
	// 				await fetch('/api/compress-photo', {
	// 					method: 'POST',
	// 					headers: { 'Content-Type': 'application/json' },
	// 					body: JSON.stringify({ fileId: photo.id, fileName: photo.name }),
	// 				})
	// 				setCompressionProgress(prev => ({ ...prev, current: prev.current + 1 }))
	// 			} catch (err) {
	// 				console.error(`Nie udało się skompresować zdjęcia: ${photo.name}`, err)
	// 				toast.error(`Błąd podczas kompresji zdjęcia ${photo.name}`)
	// 			}
	// 		}
	// 		toast.success(`Kompresja zakończona! Zoptymalizowano ${photosToCompress.length} zdjęć.`)
	// 	} catch (error: unknown) {
	// 		let errorMessage = 'Wystąpił nieoczekiwany błąd.'

	// 		if (error instanceof Error) {
	// 			errorMessage = error.message
	// 		}

	// 		toast.error(errorMessage)
	// 		console.error('Błąd podczas procesu kompresji:', error)
	// 	} finally {
	// 		setIsCompressing(false)
	// 	}
	// }

	return (
		<div>
			<div className='mb-6 p-4 bg-slate-50 rounded-lg flex items-center justify-between gap-4 flex-wrap'>
				<p className='text-slate-600 text-sm'>Zarządzaj okładką lub zoptymalizuj zdjęcia w albumie.</p>
				<div className='flex items-center gap-2'>
					<button
						onClick={() => setIsSettingCover(!isSettingCover)}
						className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
							isSettingCover
								? 'bg-orange-500 text-white hover:bg-orange-600'
								: 'bg-blue-600 text-white hover:bg-blue-700'
						}`}>
						{isSettingCover ? 'Anuluj' : 'Zmień okładkę'}
					</button>
					{/* <button
						onClick={handleStartCompression}
						disabled={isCompressing}
						className='px-4 py-2 rounded-md text-sm font-semibold transition-colors bg-green-600 text-white hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-wait'>
						{isCompressing
							? `Kompresowanie... ${compressionProgress.current}/${compressionProgress.total}`
							: 'Skompresuj zdjęcia'}
					</button> */}
				</div>
			</div>

			<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
				{photos.map((photo, index) => (
					<div key={photo.id} className='group relative' onClick={() => handleOpenModal(index)}>
						<div className='aspect-square w-full overflow-hidden rounded-lg bg-slate-100'>
							{photo.thumbnailLink && (
								<img src={photo.thumbnailLink} alt={photo.name} className='w-full h-full object-cover' />
							)}
							{photo.videoMediaMetadata && <PlayIcon />}
						</div>
						{isSettingCover && (
							<div className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
								<button
									onClick={e => {
										e.stopPropagation()
										handleSetCover(photo.id)
									}}
									disabled={isLoading === photo.id || currentCoverId === photo.id || !!photo.videoMediaMetadata}
									className='px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform'>
									{isLoading === photo.id
										? 'Ustawianie...'
										: currentCoverId === photo.id
										? 'To jest okładka'
										: photo.videoMediaMetadata
										? 'To jest film'
										: 'Ustaw jako okładkę'}
								</button>
							</div>
						)}
						{currentCoverId === photo.id && (
							<div className='absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full pointer-events-none shadow-lg'>
								Okładka
							</div>
						)}
					</div>
				))}
			</div>

			{selectedPhotoIndex !== null && (
				<div
					className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center'
					onClick={handleCloseModal}>
					<button
						className='absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-50'
						onClick={handleCloseModal}
						aria-label='Zamknij podgląd'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-8 h-8'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
						</svg>
					</button>

					<button
						className='absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-50'
						onClick={e => {
							e.stopPropagation()
							handlePrevPhoto()
						}}
						aria-label='Poprzednie zdjęcie'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-10 h-10'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
						</svg>
					</button>

					<button
						className='absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-50'
						onClick={e => {
							e.stopPropagation()
							handleNextPhoto()
						}}
						aria-label='Następne zdjęcie'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							strokeWidth={1.5}
							stroke='currentColor'
							className='w-10 h-10'>
							<path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
						</svg>
					</button>

					<div className='relative w-full h-full max-w-screen-lg max-h-screen p-12' onClick={e => e.stopPropagation()}>
						{photos[selectedPhotoIndex]?.videoMediaMetadata ? (
							<video
								src={`/api/stream/${photos[selectedPhotoIndex].id}`}
								controls
								autoPlay
								className='w-full h-full object-contain'>
								Twoja przeglądarka nie obsługuje tagu wideo.
							</video>
						) : (
							<img
								src={photos[selectedPhotoIndex].thumbnailLink!.replace(/=s\d+/, '=s1600')}
								alt={photos[selectedPhotoIndex].name}
								className='w-full h-full object-contain'
							/>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
