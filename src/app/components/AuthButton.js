// app/components/AuthButton.js

'use client'

import { signIn, signOut } from 'next-auth/react'

const baseButtonStyles =
	'inline-flex w-full items-center justify-center rounded-full text-base font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none px-8 py-3'

export function AuthButton() {
	return (
		<button
			onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
			className={`${baseButtonStyles} bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus-visible:ring-blue-500 hover:scale-105 active:scale-100`}>
			Zaloguj się przez Google
		</button>
	)
}

export function SignOutButton() {
	return (
		<button
			onClick={() => signOut({ callbackUrl: '/' })}
			className='inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors bg-red-600 text-white hover:bg-red-700 px-4 py-2'>
			Wyloguj się
		</button>
	)
}
