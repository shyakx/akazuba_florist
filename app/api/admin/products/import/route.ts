import { NextRequest, NextResponse } from 'next/server'

interface ImportProduct {
  name: string
  price: number
  description: string
  category: string
  color?: string
  type?: string
  images: string[]
  videos: string[]
}

interface ImportResult {
  success: number
  errors: number
  total: number
  details: Array<{
    row: number
    product: string
    status: 'success' | 'error'
    message: string
  }>
}

export async function POST(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { products }: { products: ImportProduct[] } = body

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { success: false, message: 'Products array is required' },
        { status: 400 }
      )
    }

    const result: ImportResult = {
      success: 0,
      errors: 0,
      total: products.length,
      details: []
    }

    // Process each product using the existing product creation API
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      
      try {
        // Validate required fields
        if (!product.name || !product.description || product.price <= 0) {
          result.details.push({
            row: i + 1,
            product: product.name || 'Unknown',
            status: 'error',
            message: 'Missing required fields (name, description, or invalid price)'
          })
          result.errors++
          continue
        }

        // Create product using the existing API structure
        const productData = {
          name: product.name,
          description: product.description,
          shortDescription: product.description.substring(0, 150) + (product.description.length > 150 ? '...' : ''),
          price: product.price,
          stockQuantity: 10, // Default stock
          categoryName: product.category, // Use categoryName for unifiedProductService
          images: product.images.length > 0 ? product.images : [],
          videos: product.videos.length > 0 ? product.videos : [],
          color: product.color || '',
          type: product.type || '',
          isActive: true,
          isFeatured: false,
          tags: [product.color, product.type].filter(Boolean)
        }

        // Create product using the unified product service
        try {
          // Import the unified product service
          const { unifiedProductService } = await import('@/lib/unifiedProductService')
          
          // Extract token from auth header
          const token = authHeader.replace('Bearer ', '')
          
          console.log(`🔄 Creating product ${i + 1}: ${product.name}`)
          console.log(`📝 Product data:`, productData)
          
          // Create the product
          const createdProduct = await unifiedProductService.createProductWithToken(productData, token)
          
          console.log(`✅ Created product result:`, createdProduct ? `ID: ${createdProduct.id}` : 'null')
          
          if (createdProduct) {
            result.details.push({
              row: i + 1,
              product: product.name,
              status: 'success',
              message: `Successfully created: ${product.name} (ID: ${createdProduct.id})`
            })
            result.success++
          } else {
            result.details.push({
              row: i + 1,
              product: product.name,
              status: 'error',
              message: `Failed to create product: No response from service`
            })
            result.errors++
          }
        } catch (createError) {
          console.error(`❌ Error creating product ${product.name}:`, createError)
          result.details.push({
            row: i + 1,
            product: product.name,
            status: 'error',
            message: `Service Error: ${createError instanceof Error ? createError.message : 'Unknown error'}`
          })
          result.errors++
        }

      } catch (error) {
        console.error(`Error processing product ${product.name}:`, error)
        result.details.push({
          row: i + 1,
          product: product.name,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
        result.errors++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import processing completed. ${result.success} products processed successfully, ${result.errors} errors.`,
      data: result
    })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error during import',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Generate import template
export async function GET(request: NextRequest) {
  try {
    const template = {
      csv: `name,price,description,category,color,type,images,videos
Red Rose,45500,"Beautiful red rose perfect for any occasion",flowers,red,Rose,"/images/flowers/red-rose-1.jpg|/images/flowers/red-rose-2.jpg","/videos/red-rose-demo.mp4"
White Lily,39000,"Elegant white lily for special moments",flowers,white,Lily,"/images/flowers/white-lily-1.jpg","/videos/white-lily-demo.mp4"
Pink Peony,52000,"Gorgeous pink peony for celebrations",flowers,pink,Peony,"/images/flowers/pink-peony-1.jpg|/images/flowers/pink-peony-2.jpg",""
Luxury Perfume,125000,"Premium fragrance for special occasions",perfumes,n/a,Perfume,"/images/perfumes/luxury-perfume.jpg","/videos/perfume-demo.mp4"`,
      
      json: [
        {
          name: "Red Rose",
          price: 45500,
          description: "Beautiful red rose perfect for any occasion",
          category: "flowers",
          color: "red",
          type: "Rose",
          images: ["/images/flowers/red-rose-1.jpg", "/images/flowers/red-rose-2.jpg"],
          videos: ["/videos/red-rose-demo.mp4"]
        },
        {
          name: "White Lily",
          price: 39000,
          description: "Elegant white lily for special moments",
          category: "flowers",
          color: "white",
          type: "Lily",
          images: ["/images/flowers/white-lily-1.jpg"],
          videos: ["/videos/white-lily-demo.mp4"]
        },
        {
          name: "Pink Peony",
          price: 52000,
          description: "Gorgeous pink peony for celebrations",
          category: "flowers",
          color: "pink",
          type: "Peony",
          images: ["/images/flowers/pink-peony-1.jpg", "/images/flowers/pink-peony-2.jpg"],
          videos: []
        },
        {
          name: "Luxury Perfume",
          price: 125000,
          description: "Premium fragrance for special occasions",
          category: "perfumes",
          color: "n/a",
          type: "Perfume",
          images: ["/images/perfumes/luxury-perfume.jpg"],
          videos: ["/videos/perfume-demo.mp4"]
        }
      ]
    }

    return NextResponse.json({
      success: true,
      message: 'Import templates generated',
      data: template
    })

  } catch (error) {
    console.error('Template generation error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to generate templates' },
      { status: 500 }
    )
  }
}
