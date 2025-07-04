// app/page.tsx

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AuthButton } from '@/app/components/AuthButton'
import LoginBackground from '@/app/components/LoginBackground'

export default async function HomePage() {
	const session = await getServerSession(authOptions)

	if (session) {
		redirect('/dashboard')
	}

	return (
		<main className='relative min-h-screen flex items-center justify-center p-4'>
			<LoginBackground />

			<div className='relative z-10 w-full max-w-md text-center p-8 space-y-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl'>
				<div>
					<h1 className='text-4xl font-bold text-white tracking-tight drop-shadow-lg'>Galeria Zdjęć</h1>
					<p className='mt-3 text-lg text-white/80 drop-shadow-md'>Zarządzaj swoimi albumami.</p>
				</div>
				<div className='pt-4'>
					<AuthButton />
				</div>
			</div>
		</main>
	)
}
