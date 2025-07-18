import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import AuthProvider from './components/AuthProvider'
import { Toaster } from 'sonner'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Nautil Galeria',
	description: 'Generated by create next app',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<head>
				<link
					rel='icon'
					href='https://nautil.pl/audyt-architektoniczny/wp-content/uploads/2025/06/cropped-fav-32x32.png'
					sizes='32x32'
				/>
				<link
					rel='icon'
					href='https://nautil.pl/audyt-architektoniczny/wp-content/uploads/2025/06/cropped-fav-192x192.png'
					sizes='192x192'
				/>
				<link
					rel='apple-touch-icon'
					href='https://nautil.pl/audyt-architektoniczny/wp-content/uploads/2025/06/cropped-fav-180x180.png'
				/>
				<meta
					name='msapplication-TileImage'
					content='https://nautil.pl/audyt-architektoniczny/wp-content/uploads/2025/06/cropped-fav-270x270.png'
				/>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}>
				<AuthProvider>
					<Toaster position='bottom-right' richColors />
					{children}
				</AuthProvider>
			</body>
		</html>
	)
}
