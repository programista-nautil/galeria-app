import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { clientFolderMapping } from '@/lib/permissions'

const authOptions: AuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
					scope: 'openid email profile',
				},
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async signIn({ user }) {
			if (user.email && clientFolderMapping.hasOwnProperty(user.email)) {
				return true
			} else {
				console.log(`ACCESS DENIED for unauthorized user: ${user.email}`)

				return false
			}
		},
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions }
