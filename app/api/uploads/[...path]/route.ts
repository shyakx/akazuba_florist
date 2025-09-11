import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const imagePath = params.path.join('/')
    
    // First, try to get the image from the backend
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5000' 
      : 'https://akazuba-backend-api.onrender.com'
    
    try {
      const backendImageUrl = `${backendUrl}/uploads/${imagePath}`
      console.log('🔄 Fetching image from backend:', backendImageUrl)
      
      const backendResponse = await fetch(backendImageUrl, {
        method: 'GET',
        headers: {
          'Accept': 'image/*',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })
      
      if (backendResponse.ok) {
        const imageBuffer = await backendResponse.arrayBuffer()
        const contentType = backendResponse.headers.get('content-type') || 'image/jpeg'
        
        console.log('✅ Image found on backend, serving directly')
        
        // Optional: Cache the image locally for future requests
        try {
          const localPath = path.join(process.cwd(), 'public', 'uploads', imagePath)
          await fs.mkdir(path.dirname(localPath), { recursive: true })
          await fs.writeFile(localPath, Buffer.from(imageBuffer))
          console.log('💾 Cached image locally for future requests')
        } catch (cacheError) {
          console.log('⚠️ Could not cache image locally:', cacheError.message)
        }
        
        return new NextResponse(imageBuffer, {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
            'X-Image-Source': 'backend',
          },
        })
      }
    } catch (backendError) {
      console.log('⚠️ Backend image not available, trying local fallback:', backendError.message)
    }
    
    // Fallback: Check local public/uploads directory
    const localPath = path.join(process.cwd(), 'public', 'uploads', imagePath)
    try {
      await fs.access(localPath)
      const fileBuffer = await fs.readFile(localPath)
      const ext = path.extname(localPath).toLowerCase()
      
      let contentType = 'application/octet-stream'
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg'
          break
        case '.png':
          contentType = 'image/png'
          break
        case '.gif':
          contentType = 'image/gif'
          break
        case '.webp':
          contentType = 'image/webp'
          break
      }
      
      console.log('✅ Image found locally, serving from cache')
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400',
          'X-Image-Source': 'local-cache',
        },
      })
    } catch (localError) {
      console.log('⚠️ Local image not found, using placeholder')
      // If neither backend nor local file exists, return placeholder
      const placeholderPath = path.join(process.cwd(), 'public', 'images', 'placeholder-product.jpg')
      const placeholderBuffer = await fs.readFile(placeholderPath)
      
      return new NextResponse(placeholderBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    }
  } catch (error) {
    console.error('Error serving uploaded image:', error)
    
    // Return placeholder on error
    try {
      const placeholderPath = path.join(process.cwd(), 'public', 'images', 'placeholder-product.jpg')
      const placeholderBuffer = await fs.readFile(placeholderPath)
      
      return new NextResponse(placeholderBuffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=3600',
        },
      })
    } catch {
      return new NextResponse('Image not found', { status: 404 })
    }
  }
}
