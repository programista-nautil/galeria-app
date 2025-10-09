// app/page.tsx

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AuthButton } from '@/app/components/AuthButton'
import Image from 'next/image'
import Link from 'next/link'

const images = [
	{
		src: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=800&auto=format&fit=crop',
		alt: 'Rzeka pod górą',
		width: 800,
		height: 1199,
	},
	{
		src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop',
		alt: 'Zielone pola ryżowe z lotu ptaka',
		width: 800,
		height: 533,
	},
	{
		src: 'https://images.unsplash.com/photo-1519068261745-b3f8ecd6b8d9?q=80&w=677&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		alt: 'Góra w scenerii zimowej',
		width: 800,
		height: 1000,
	},
	{
		src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800&auto=format&fit=crop',
		alt: 'Leśna ścieżka w jesiennej mgle',
		width: 800,
		height: 533,
	},
	{
		src: 'https://images.unsplash.com/photo-1498598457418-36ef20772bb9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		alt: 'Człowiek na górze',
		width: 800,
		height: 534,
	},
	{
		src: 'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?q=80&w=800&auto=format&fit=crop',
		alt: 'Dziewczyna na huśtawce na plaży',
		width: 800,
		height: 1000,
	},
]

export default async function HomePage() {
	const session = await getServerSession(authOptions)

	if (session) {
		redirect('/dashboard')
	}

	return (
		<div className='bg-slate-50 h-screen flex flex-col overflow-hidden'>
			<div className='flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col'>
				{/* MODYFIKACJA HEADER: flex justify-between do rozdzielenia loga i przycisku */}
				<header className='px-4 sm:px-6 lg:px-8 py-6 lg:py-8 shrink-0 flex justify-between items-center'>
					{/* Logo po lewej stronie */}
					<Link href='/'>
						<img src={'/nautil-logo-czarne.svg'} alt='Logo Nautil' className='h-12 w-auto' />
					</Link>

					{/* Przycisk cennika po prawej stronie */}
                    <Link 
                        href='/pricing' 
                        className='
                            px-4 py-2 rounded-xl text-sm font-semibold 
                            bg-gray-200 text-gray-700 shadow-md border-2 border-gray-200
                            transition duration-500 ease-in-out transform hover:scale-[1.05] 
                            hover:bg-[#155DFC] hover:text-white hover:border-[#155DFC] hover:shadow-xl
                            focus:outline-none focus:ring-2 focus:ring-[#155DFC] focus:ring-offset-4 focus:ring-offset-slate-50'
                        // ALTERNATYWNY OPIS DLA WCAG
                        aria-label="Sprawdź aktualny cennik"
                    >
                        Cennik
                    </Link>
				</header>
				<div className='flex-grow container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col'>
					<main className='flex-grow grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
						<div className='text-center lg:text-left'>
							<h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight'>
								Galeria Zdjęć
							</h1>
							<p className='mt-4 text-lg text-slate-600 max-w-md mx-auto lg:mx-0'>
								Zarządzaj swoimi albumami w prosty i intuicyjny sposób.
							</p>
						</div>

						<div className='w-full max-w-md mx-auto'>
							<div className='bg-white p-8 rounded-2xl shadow-xl border border-slate-200/80'>
								<h2 className='text-2xl font-semibold text-center text-slate-800 mb-2'>Witaj z powrotem!</h2>
								<p className='text-slate-500 text-center mb-8'>Zaloguj się, aby kontynuować.</p>
								<AuthButton />
								<div className='text-center mt-8'>
									<a
										href='https://nautil.pl'
										target='_blank'
										rel='noopener noreferrer'
										className='text-sm text-slate-500 hover:text-blue-600 hover:underline transition-colors group inline-flex items-center gap-1.5'>
										Odwiedź stronę główną nautil.pl
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 20 20'
											fill='currentColor'
											className='w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5'>
											<path
												fillRule='evenodd'
												d='M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z'
												clipRule='evenodd'
											/>
										</svg>
									</a>
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>

			{/* Stopka z układem masonry opartym na CSS Grid */}
			<footer className='w-full shrink-0 h-110 p-2'>
				<div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 h-full'>
					{/* Kolumna 1: Dwa małe zdjęcia */}
					<div className='flex flex-col gap-2'>
						<div className='h-1/2 w-full relative'>
							<Image src={images[1]} alt={images[1].alt} fill className='object-cover rounded-lg' priority />
						</div>
						<div className='h-1/2 w-full relative'>
							<Image src={images[3]} alt={images[3].alt} fill className='object-cover rounded-lg' priority />
						</div>
					</div>

					{/* Kolumna 2: Jedno duże zdjęcie */}
					<div className='h-full w-full relative'>
						<Image src={images[0]} alt={images[0].alt} fill className='object-cover rounded-lg' priority />
					</div>

					{/* Kolumna 3: Jedno duże zdjęcie (ukryte na małych ekranach) */}
					<div className='h-full w-full relative hidden md:block'>
						<Image src={images[2]} alt={images[2].alt} fill className='object-cover rounded-lg' priority />
					</div>

					{/* Kolumna 4: Dwa małe zdjęcia (ukryte na małych ekranach) */}
					<div className='flex-col gap-2 hidden md:flex'>
						<div className='h-1/2 w-full relative'>
							<Image src={images[4]} alt={images[4].alt} fill className='object-cover rounded-lg' priority />
						</div>
						<div className='h-1/2 w-full relative'>
							<Image
								src='https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=800&auto=format&fit=crop'
								alt='Droga mleczna nad górami'
								fill
								className='object-cover rounded-lg'
								priority
							/>
						</div>
					</div>

					{/* Kolumna 5 i 6 dla największych ekranów */}
					<div className='h-full w-full relative hidden lg:block'>
						<Image src={images[5]} alt={images[5].alt} fill className='object-cover rounded-lg' priority />
					</div>
					<div className='flex-col gap-2 hidden lg:flex'>
						<div className='h-1/2 w-full relative'>
							<Image
								src='https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=800&auto=format&fit=crop'
								alt='Drewniany pomost nad jeziorem'
								fill
								className='object-cover rounded-lg'
								priority
							/>
						</div>
						<div className='h-1/2 w-full relative'>
							<Image
								src='https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800&auto=format&fit=crop'
								alt='Osoba w żółtym płaszczu w lesie'
								fill
								className='object-cover rounded-lg'
								priority
							/>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
