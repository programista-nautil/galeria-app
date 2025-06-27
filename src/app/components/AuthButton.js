// app/components/AuthButtons.tsx

'use client'

import { signIn, signOut } from 'next-auth/react'

const baseButtonStyles =
	'inline-flex items-center justify-center rounded-full text-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none px-8 py-3'

export function AuthButton() {
	return (
		<button
			onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
			className={`${baseButtonStyles} bg-white text-slate-900 shadow-lg hover:bg-slate-200 hover:scale-105 active:scale-100`}>
			Zaloguj się przez Google
		</button>
	)
}

export function SignOutButton() {
	return (
		<button
			onClick={() => signOut({ callbackUrl: '/' })}
			className={`${baseButtonStyles} bg-red-600 text-white hover:bg-red-700`}>
			Wyloguj się
		</button>
	)
}
