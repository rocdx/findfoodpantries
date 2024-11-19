import './globals.css'
import Loading from './loading'
import NavBar from '../components/NavBar/NavBar'
import { Roboto } from 'next/font/google'
import Providers from '@/lib/providers'
import { Suspense } from 'react'
import AuthProviders from '@/components/Auth/AuthProviders'

const roboto = Roboto({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'food.ai',
  description: 'Free food',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Providers>
          <Suspense fallback={<Loading />}>
            <AuthProviders>
              <NavBar />
              {children}
            </AuthProviders>
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
