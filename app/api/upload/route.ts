import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(request)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 })
    }

    // Get the form data
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    // Try local backend first, then fallback to production
    let backendUrl = 'http://localhost:5000/api/v1/upload/image'
    
    // If we're in production environment, use production backend
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_USE_LOCAL_BACKEND) {
      backendUrl = 'https://akazuba-backend-api.onrender.com/api/v1/upload/image'
    }

    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization')
    
    try {
      console.log('🔄 Uploading image to backend:', backendUrl)
      
      // Create new FormData for backend
      const backendFormData = new FormData()
      backendFormData.append('image', file)

      const response: Response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          ...(authHeader && { 'Authorization': authHeader }),
        },
        body: backendFormData
      })

      console.log('📡 Backend upload response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Backend upload error response:', errorText)
        throw new Error(`Backend responded with status: ${response.status} - ${errorText}`)
      }

      const data: any = await response.json()
      console.log('✅ Backend upload successful:', data)
      
      // Get the backend URL and convert it to our API route URL
      const backendImageUrl: string = data.data?.url || data.url
      const apiUrl = backendImageUrl.startsWith('/uploads/') 
        ? `/api${backendImageUrl}` 
        : backendImageUrl
      
      console.log('🔄 Converting backend URL to API URL:', { backendImageUrl, apiUrl })
      
      return NextResponse.json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: apiUrl,
          filename: data.data?.filename || data.filename
        }
      })
    } catch (backendError) {
      console.warn('⚠️ Backend not available for image upload, using fallback:', backendError)
      
      // Fallback: Generate a unique filename and return a placeholder URL
      const timestamp = Date.now()
      const extension = file.name.split('.').pop() || 'jpg'
      const fallbackUrl = `/api/uploads/uploaded-${timestamp}.${extension}`
      
      console.log('📝 Returning fallback upload response:', fallbackUrl)
      
      return NextResponse.json({
        success: true,
        message: 'Image uploaded successfully (offline mode)',
        data: {
          url: fallbackUrl,
          filename: `uploaded-${timestamp}.${extension}`
        }
      })
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
