// src/app/dashboard/components/BulkCompressButton.tsx

'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export function BulkCompressButton() {
	const [isBulkCompressing, setIsBulkCompressing] = useState(false)

	const handleBulkCompress = async () => {
		const confirmed = window.confirm(
			'Czy na pewno chcesz rozpocząć masową kompresję wszystkich nieskompresowanych zdjęć we wszystkich albumach? Ta operacja jest nieodwracalna i może potrwać bardzo długo.'
		)

		if (!confirmed) {
			return
		}

		setIsBulkCompressing(true)
		toast.info('Rozpoczynanie masowej kompresji... To może potrwać.')

		try {
			const response = await fetch('/api/admin/bulk-compress', { method: 'POST' })
			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || 'Wystąpił błąd serwera.')
			}

			toast.success(result.message)
		} catch (error: unknown) {
			let errorMessage = 'Wystąpił nieoczekiwany błąd.'

			if (error instanceof Error) {
				errorMessage = error.message
			}

			toast.error(errorMessage)
			console.error('Błąd podczas masowej kompresji:', error)
		} finally {
			setIsBulkCompressing(false)
		}
	}

	return (
		<button
			onClick={handleBulkCompress}
			disabled={isBulkCompressing}
			className='px-4 py-2 rounded-md text-sm font-semibold transition-colors bg-amber-500 text-white hover:bg-amber-600 disabled:bg-slate-400 disabled:cursor-wait'>
			{isBulkCompressing ? 'Przetwarzanie...' : 'Skompresuj wszystko'}
		</button>
	)
}
