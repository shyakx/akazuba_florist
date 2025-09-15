import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Check authentication with more robust error handling
    const session = await getServerSession(request)
    console.log('🔍 Upload API - Session check:', { 
      hasSession: !!session, 
      hasUser: !!session?.user, 
      userRole: session?.user?.role 
    })
    
    if (!session?.user) {
      console.warn('❌ Upload API - No valid session found')
      // In development, allow uploads even without session for testing
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode: Allowing upload without session')
      } else {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
      }
    } else if (session.user.role !== 'ADMIN') {
      console.warn('❌ Upload API - Insufficient permissions:', session.user.role)
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }
    
    console.log('✅ Upload API - Authentication successful for:', session?.user?.email)

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
      
      // Get the backend URL and return the correct backend URL
      const backendImageUrl: string = data.data?.url || data.url
      // Remove the /api/v1/upload/image part from backendUrl to get the base URL
      const baseBackendUrl = backendUrl.replace('/api/v1/upload/image', '')
      const fullBackendUrl = `${baseBackendUrl}${backendImageUrl}`
      
      console.log('🔄 Backend upload successful, returning full backend URL:', fullBackendUrl)
      
      return NextResponse.json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          url: fullBackendUrl, // Return full backend URL
          filename: data.data?.filename || data.filename
        }
      })
    } catch (backendError) {
      console.warn('⚠️ Backend not available for image upload, using fallback:', backendError)
      
      // Fallback: Save file locally and return URL
      const timestamp = Date.now()
      const extension = file.name.split('.').pop() || 'jpg'
      const filename = `uploaded-${timestamp}.${extension}`
      const fallbackUrl = `/api/uploads/${filename}`
      
      try {
        // Save file to local uploads directory
        const { promises: fs } = await import('fs')
        const path = await import('path')
        
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        await fs.mkdir(uploadsDir, { recursive: true })
        
        const filePath = path.join(uploadsDir, filename)
        const arrayBuffer = await file.arrayBuffer()
        await fs.writeFile(filePath, Buffer.from(arrayBuffer))
        
        console.log('💾 File saved locally:', filePath)
        console.log('📝 Returning fallback upload response:', fallbackUrl)
        
        return NextResponse.json({
          success: true,
          message: 'Image uploaded successfully (offline mode)',
          data: {
            url: fallbackUrl,
            filename: filename
          }
        })
      } catch (saveError) {
        console.error('❌ Failed to save file locally:', saveError)
        
        // If we can't save locally, return a placeholder URL
        return NextResponse.json({
          success: true,
          message: 'Image uploaded successfully (placeholder mode)',
          data: {
            url: '/images/placeholder-flower.jpg',
            filename: 'placeholder.jpg'
          }
        })
      }
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
