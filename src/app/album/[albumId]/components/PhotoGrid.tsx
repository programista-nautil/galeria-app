// src/app/album/[albumId]/components/PhotoGrid.tsx

'use client'
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation' // Dodano useRouter do odświeżania metadanych w tle

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

// Nowa ikona obracania
const RotateIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		fill='none'
		viewBox='0 0 24 24'
		strokeWidth={1.5}
		stroke='currentColor'
		className='w-5 h-5'>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99'
		/>
	</svg>
)

export function PhotoGrid({ photos: initialPhotos, folderId }: { photos: Photo[]; folderId: string }) {
	// Używamy lokalnego stanu dla zdjęć, aby móc aktualizować URL-e po obrocie
	const [photos, setPhotos] = useState<Photo[]>(initialPhotos)
	const [isSettingCover, setIsSettingCover] = useState(false)
	const [loadingPhotoIds, setLoadingPhotoIds] = useState<Set<string>>(new Set())
	const router = useRouter()

	const initialCoverId = photos.find(p => p.name.includes('_cover'))?.id
	const [currentCoverId, setCurrentCoverId] = useState<string | undefined>(initialCoverId)
	const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)

	// Aktualizacja stanu gdy przychodzą nowe propsy (np. po nawigacji)
	useEffect(() => {
		setPhotos(initialPhotos)
	}, [initialPhotos])

	const togglePhotoLoading = (id: string, isLoading: boolean) => {
		setLoadingPhotoIds(prev => {
			const newSet = new Set(prev)
			if (isLoading) {
				newSet.add(id)
			} else {
				newSet.delete(id)
			}
			return newSet
		})
	}

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

	// ... (zachowana logika handleSetCover - bez zmian) ...
	const handleSetCover = async (fileId: string) => {
		const previousCoverId = currentCoverId
		togglePhotoLoading(fileId, true)
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
			router.refresh() // Odśwież dane serwera
		} catch (error: unknown) {
			console.error(error)
			toast.error('Wystąpił błąd podczas ustawiania okładki.')
			setCurrentCoverId(previousCoverId)
		} finally {
			togglePhotoLoading(fileId, false)
		}
	}

	// Nowa funkcja do obracania zdjęć
	const handleRotatePhoto = async (fileId: string) => {
		if (loadingPhotoIds.has(fileId)) return
		togglePhotoLoading(fileId, true)
		const toastId = toast.loading('Obracanie zdjęcia...')

		try {
			const response = await fetch('/api/rotate-photo', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fileId }),
			})

			if (!response.ok) {
				throw new Error('Rotation failed')
			}

			// Aktualizujemy URL zdjęcia w lokalnym stanie, dodając timestamp, żeby wymusić odświeżenie cache przeglądarki
			setPhotos(prevPhotos =>
				prevPhotos.map(p => {
					if (p.id === fileId && p.thumbnailLink) {
						const separator = p.thumbnailLink.includes('?') ? '&' : '?'
						return {
							...p,
							thumbnailLink: `${p.thumbnailLink}${separator}t=${Date.now()}`,
						}
					}
					return p
				})
			)

			toast.success('Zdjęcie obrócone!', { id: toastId })
		} catch (error) {
			console.error(error)
			toast.error('Nie udało się obrócić zdjęcia.', { id: toastId })
		} finally {
			togglePhotoLoading(fileId, false)
		}
	}

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
				</div>
			</div>

			<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
				{photos.map((photo, index) => {
					const isPhotoLoading = loadingPhotoIds.has(photo.id)

					return (
						<div key={photo.id} className='group relative cursor-pointer' onClick={() => handleOpenModal(index)}>
							<div className='aspect-square w-full overflow-hidden rounded-lg bg-slate-100 relative'>
								{photo.thumbnailLink && (
									<img
										src={photo.thumbnailLink}
										alt={photo.name}
										className={`w-full h-full object-cover transition-opacity duration-300 ${
											isPhotoLoading ? 'opacity-50' : 'opacity-100'
										}`}
									/>
								)}
								{photo.videoMediaMetadata && <PlayIcon />}

								{/* Spinner ładowania podczas obracania */}
								{isPhotoLoading && (
									<div className='absolute inset-0 flex items-center justify-center'>
										<div className='w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
									</div>
								)}
							</div>

							{/* Przycisk obracania - widoczny tylko na hover i jeśli to nie wideo i nie tryb ustawiania okładki */}
							{!photo.videoMediaMetadata && !isSettingCover && !isPhotoLoading && (
								<button
									onClick={e => {
										e.stopPropagation()
										handleRotatePhoto(photo.id)
									}}
									className='absolute bottom-2 right-2 p-2 bg-white/90 text-slate-700 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50 hover:text-blue-600 z-10'
									title='Obróć o 90° w prawo'>
									<RotateIcon />
								</button>
							)}

							{/* Overlay ustawiania okładki */}
							{isSettingCover && (
								<div className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg'>
									<button
										onClick={e => {
											e.stopPropagation()
											handleSetCover(photo.id)
										}}
										disabled={isPhotoLoading || currentCoverId === photo.id || !!photo.videoMediaMetadata}
										className='px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform'>
										{isPhotoLoading
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
								<div className='absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full pointer-events-none shadow-lg z-10'>
									Okładka
								</div>
							)}
						</div>
					)
				})}
			</div>

			{/* Modal - zachowany bez większych zmian, używa photos ze stanu */}
			{selectedPhotoIndex !== null && (
				<div
					className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center'
					onClick={handleCloseModal}>
					{/* ... (przyciski nawigacji i zamknięcia bez zmian) ... */}
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

					<div
						className='relative w-full h-full max-w-screen-lg max-h-screen p-12 flex items-center justify-center'
						onClick={e => e.stopPropagation()}>
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
								src={photos[selectedPhotoIndex].thumbnailLink!.replace(/=s\d+/, '=s1600')} // Używamy zmodyfikowanego linku ze stanu
								alt={photos[selectedPhotoIndex].name}
								className='w-full h-full object-contain max-h-[85vh]'
							/>
						)}
					</div>
				</div>
			)}
		</div>
	)
}
// =========KONIEC ZMIANY=========
