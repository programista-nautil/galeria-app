// types/next-auth.d.ts

import 'next-auth'
import 'next-auth/jwt'

// Rozszerzamy domyślne typy dostarczane przez next-auth

declare module 'next-auth' {
	/**
	 * Typ zwracany przez hook `useSession` lub funkcję `getSession`.
	 * Rozszerzamy go o nasze niestandardowe pola.
	 */
	interface Session {
		user: {
			/** Domyślne właściwości: name, email, image */
			name?: string | null
			email?: string | null
			image?: string | null

			/** Nasze niestandardowe właściwości */
			accessToken?: string
			refreshToken?: string
		}
	}
}

declare module 'next-auth/jwt' {
	/**
	 * Typ dla JSON Web Token. Również rozszerzamy o nasze pola.
	 */
	interface JWT {
		accessToken?: string
		refreshToken?: string
	}
}
