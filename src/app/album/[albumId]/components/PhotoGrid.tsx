'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

interface Photo {
	id: string
	name: string
	thumbnailLink?: string | null
}

export function PhotoGrid({ photos, folderId }: { photos: Photo[]; folderId: string }) {
	const [isSettingCover, setIsSettingCover] = useState(false)
	const [isLoading, setIsLoading] = useState<string | null>(null)

	const initialCoverId = photos.find(p => p.name.includes('_cover'))?.id

	const [currentCoverId, setCurrentCoverId] = useState<string | undefined>(initialCoverId)

	const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)

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
		} catch (error) {
			console.error(error)
			toast.error('Wystąpił błąd podczas ustawiania okładki.')
			setCurrentCoverId(previousCoverId)
		} finally {
			setIsLoading(null)
		}
	}

	return (
		<div>
			<div className='mb-6 p-4 bg-slate-50 rounded-lg flex items-center justify-between'>
				<p className='text-slate-600'>Wybierz akcję do wykonania w tym albumie.</p>
				<button
					onClick={() => setIsSettingCover(!isSettingCover)}
					className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
						isSettingCover ? 'bg-red-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
					}`}>
					{isSettingCover ? 'Anuluj' : 'Zmień okładkę'}
				</button>
			</div>

			<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
				{photos.map((photo, index) => (
					<div key={photo.id} className='group relative' onClick={() => handleOpenModal(index)}>
						<div className='aspect-square w-full overflow-hidden rounded-lg bg-slate-100'>
							{photo.thumbnailLink && (
								<img src={photo.thumbnailLink} alt={photo.name} className='w-full h-full object-cover' />
							)}
						</div>
						{isSettingCover && (
							<div className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
								<button
									onClick={() => handleSetCover(photo.id)}
									disabled={isLoading === photo.id || currentCoverId === photo.id}
									className='px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform'>
									{isLoading === photo.id
										? 'Ustawianie...'
										: currentCoverId === photo.id
										? 'To jest okładka'
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
						{photos[selectedPhotoIndex]?.thumbnailLink && (
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
