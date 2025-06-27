'use client'

import { useState } from 'react'

interface Photo {
	id: string
	name: string
	thumbnailLink?: string | null
}

export function PhotoGrid({ photos, folderId }: { photos: Photo[]; folderId: string }) {
	const [isSettingCover, setIsSettingCover] = useState(false)
	const [isLoading, setIsLoading] = useState<string | null>(null)

	const handleSetCover = async (fileId: string) => {
		setIsLoading(fileId)
		try {
			const response = await fetch('/api/set-cover', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ fileId, folderId }),
			})
			if (!response.ok) {
				throw new Error('Failed to set cover')
			}

			setIsSettingCover(false)
		} catch (error) {
			console.error(error)
			alert('Nie udało się ustawić okładki.')
		} finally {
			setIsLoading(null)
		}
	}

	const currentCover = photos.find(p => p.name.includes('_cover'))

	return (
		<div>
			<div className='mb-6 p-4 bg-slate-50 rounded-lg flex items-center justify-between'>
				<p className='text-slate-600'>Wybierz akcję do wykonania w tym albumie.</p>
				<button
					onClick={() => setIsSettingCover(!isSettingCover)}
					className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
						isSettingCover ? 'bg-red-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
					}`}>
					{isSettingCover ? 'Anuluj' : 'Ustaw okładkę'}
				</button>
			</div>

			<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
				{photos.map(photo => (
					<div key={photo.id} className='group relative'>
						<div className='aspect-square w-full overflow-hidden rounded-lg bg-slate-100'>
							{photo.thumbnailLink && (
								<img src={photo.thumbnailLink} alt={photo.name} className='w-full h-full object-cover' />
							)}
						</div>
						{isSettingCover && (
							<div className='absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
								<button
									onClick={() => handleSetCover(photo.id)}
									disabled={isLoading === photo.id}
									className='px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-full disabled:opacity-50'>
									{isLoading === photo.id ? 'Ustawianie...' : 'Ustaw jako okładkę'}
								</button>
							</div>
						)}
						{currentCover?.id === photo.id && (
							<div className='absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full pointer-events-none'>
								Okładka
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	)
}
