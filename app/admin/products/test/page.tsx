'use client'

import { useEffect, useState } from 'react'

export default function ImageTestPage() {
  const [testResults, setTestResults] = useState<any[]>([])

  const testImages = [
    '/images/flowers/red/red-1.jpg',
    '/images/flowers/red/red-2.jpg',
    '/images/flowers/white/white-1.jpg',
    '/images/flowers/mixed/mixed-1.jpg',
    '/images/flowers/pink/pink-1.jpg',
    '/images/flowers/yellow/yellow-1.jpg',
    '/images/placeholder-flower.jpg'
  ]

  useEffect(() => {
    const testImageLoading = async () => {
      const results = []
      
      for (const imagePath of testImages) {
        const result = await new Promise<{path: string, success: boolean, error?: string}>((resolve) => {
          const img = new window.Image()
          img.onload = () => resolve({ path: imagePath, success: true })
          img.onerror = () => resolve({ path: imagePath, success: false, error: 'Failed to load' })
          img.src = imagePath
        })
        results.push(result)
      }
      
      setTestResults(results)
    }

    testImageLoading()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Image Loading Test</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testImages.map((imagePath, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">{imagePath.split('/').pop()}</h3>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={imagePath}
                alt={`Test ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/placeholder-flower.jpg'
                }}
              />
            </div>
            <p className="text-xs mt-2">
              Status: {testResults[index]?.success ? '✅ Loaded' : testResults[index]?.success === false ? '❌ Failed' : '⏳ Testing...'}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Test Results Summary</h2>
        <div className="space-y-2">
          {testResults.map((result, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span>{result?.success ? '✅' : result?.success === false ? '❌' : '⏳'}</span>
              <span className="font-mono text-sm">{result?.path}</span>
              {result?.error && <span className="text-red-500 text-sm">({result.error})</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
