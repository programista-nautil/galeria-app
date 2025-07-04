'use client'

import { useState, FormEvent } from 'react'
import { toast } from 'sonner'

export function AddAlbum() {
	const [isOpen, setIsOpen] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const [title, setTitle] = useState('')
	const [files, setFiles] = useState<FileList | null>(null)

	const handleOpen = () => setIsOpen(true)
	const handleClose = () => {
		if (isUploading) return
		setIsOpen(false)
		setTitle('')
		setFiles(null)
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!title.trim() || !files || files.length === 0) {
			toast.error('Tytuł albumu i pliki są wymagane.')
			return
		}

		setIsUploading(true)
		toast.info(`Rozpoczynanie przesyłania albumu "${title}"...`)

		const formData = new FormData()
		formData.append('title', title)
		for (let i = 0; i < files.length; i++) {
			formData.append('photos', files[i])
		}

		try {
			const response = await fetch('/api/create-album', {
				method: 'POST',
				body: formData,
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || 'Wystąpił nieznany błąd.')
			}

			toast.success(`Album "${title}" został dodany z ${result.uploadedFilesCount} zdjęciami!`)
			handleClose()
			window.location.reload()
		} catch (error) {
			let errorMessage = 'Wystąpił nieoczekiwany błąd.'
			if (error instanceof Error) {
				errorMessage = `Błąd przesyłania: ${error.message}`
			}
			toast.error(errorMessage)
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<>
			<button
				onClick={handleOpen}
				className='px-4 py-2 rounded-md text-sm font-semibold transition-colors bg-blue-600 text-white hover:bg-blue-700'>
				Dodaj Album
			</button>

			{isOpen && (
				<div className='fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center'>
					<dialog open className='relative z-50 bg-white p-8 rounded-lg shadow-xl w-full max-w-lg'>
						<form onSubmit={handleSubmit}>
							<h2 className='text-2xl font-bold mb-6'>Nowy Album</h2>

							<div className='space-y-4'>
								<div>
									<label htmlFor='albumTitle' className='block text-sm font-medium text-slate-700 mb-1'>
										Tytuł Albumu
									</label>
									<input
										type='text'
										id='albumTitle'
										value={title}
										onChange={e => setTitle(e.target.value)}
										className='w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
										required
									/>
								</div>

								<div>
									<label htmlFor='photoUpload' className='block text-sm font-medium text-slate-700 mb-1'>
										Wybierz folder ze zdjęciami
									</label>
									<div className='flex items-center gap-4 mt-2'>
										{/* Ukryty, prawdziwy input */}
										<input
											type='file'
											id='photoUpload'
											onChange={e => setFiles(e.target.files)}
											// @ts-expect-error Property 'webkitdirectory' does not exist on type 'IntrinsicElements'.
											webkitdirectory='true'
											directory='true'
											multiple
											className='hidden'
										/>

										{/* Widoczny, stylowany przycisk-etykieta */}
										<label
											htmlFor='photoUpload'
											className='px-4 py-2 rounded-md text-sm font-semibold bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap'>
											Wybierz folder
										</label>

										{/* Informacja o wybranych plikach */}
										<p className='text-sm text-slate-600 truncate'>
											{files && files.length > 0 ? `Wybrano ${files.length} plików.` : 'Nie wybrano folderu.'}
										</p>
									</div>
								</div>
							</div>

							<div className='mt-8 flex justify-end gap-4'>
								<button
									type='button'
									onClick={handleClose}
									disabled={isUploading}
									className='px-4 py-2 rounded-md text-sm font-semibold bg-slate-200 hover:bg-slate-300 disabled:opacity-50'>
									Anuluj
								</button>
								<button
									type='submit'
									disabled={isUploading}
									className='px-4 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-wait'>
									{isUploading ? 'Przesyłanie...' : 'Utwórz Album'}
								</button>
							</div>
						</form>
					</dialog>
				</div>
			)}
		</>
	)
}
