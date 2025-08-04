import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Toaster } from 'sonner'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Quản lý Chi tiêu',
  description: 'Ứng dụng quản lý chi tiêu cá nhân',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-poppins antialiased">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          {/* Premium Header */}
          <header className="backdrop-blur-md bg-white/80 border-b border-white/20 shadow-sm">
            <div className="container mx-auto px-6 py-5">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-white text-xl font-bold">₫</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      Quản lý Chi tiêu
                    </h1>
                    <p className="text-xs text-gray-500 font-medium">Thông minh & Hiện đại</p>
                  </div>
                </Link>
                <nav className="flex space-x-1">
                  <Link 
                    href="/" 
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-lg transition-all duration-200"
                  >
                    Bảng điều khiển
                  </Link>
                  <Link 
                    href="/add-entry" 
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Ghi chi tiêu
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="container mx-auto px-6 py-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
        
        <Toaster 
          position="top-center"
          richColors
          closeButton
          duration={3000}
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              fontFamily: 'var(--font-poppins)',
            }
          }}
        />
      </body>
    </html>
  )
}
