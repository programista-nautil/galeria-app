// app/components/Header.tsx

'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { SignOutButton } from './AuthButton'

export default function Header() {
	const { data: session } = useSession()

	return (
		<header className='bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center py-3'>
					<div className='text-xl font-bold tracking-tight text-slate-900'>Moje Albumy</div>
					<div className='flex items-center gap-4'>
						{session?.user?.image && (
							<Image
								src={session.user.image}
								alt={session.user.name || 'User Avatar'}
								width={36}
								height={36}
								className='rounded-full'
							/>
						)}
						<SignOutButton />
					</div>
				</div>
			</div>
		</header>
	)
}
