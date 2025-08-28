import Link from 'next/link'
import { Flower, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Flower className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Oops! The page you&apos;re looking for seems to have wilted away. 
            Let&apos;s get you back to our beautiful flower collection.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-pink-600 text-white font-medium rounded-lg hover:bg-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse Our Flowers
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 