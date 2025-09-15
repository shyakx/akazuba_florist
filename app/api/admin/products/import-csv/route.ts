import { NextRequest, NextResponse } from 'next/server'

interface CSVProduct {
  name: string
  price: number
  description: string
  shortDescription: string
  category: string
  color?: string
  type?: string
  images: string[]
  videos: string[]
  stockQuantity: number
  isActive: boolean
  isFeatured: boolean
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

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  let i = 0
  
  while (i < line.length) {
    const char = line[i]
    const nextChar = line[i + 1]
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"'
        i += 2
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
        i++
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim())
      current = ''
      i++
    } else {
      current += char
      i++
    }
  }
  
  // Add the last field
  result.push(current.trim())
  
  return result
}

function parseCSV(csvContent: string): CSVProduct[] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  const products: CSVProduct[] = []
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    try {
      const fields = parseCSVLine(lines[i])
      
      if (fields.length < 12) {
        console.warn(`Skipping row ${i + 1}: insufficient fields (${fields.length})`)
        continue
      }
      
      const product: CSVProduct = {
        name: fields[0] || '',
        price: parseFloat(fields[1]) || 0,
        description: fields[2] || '',
        shortDescription: fields[3] || '',
        category: fields[4] || 'flowers',
        color: fields[5] || '',
        type: fields[6] || '',
        images: fields[7] ? fields[7].split('|').filter(img => img.trim()) : [],
        videos: fields[8] ? fields[8].split('|').filter(vid => vid.trim()) : [],
        stockQuantity: parseInt(fields[9]) || 10,
        isActive: fields[10].toLowerCase() === 'true',
        isFeatured: fields[11].toLowerCase() === 'true'
      }
      
      products.push(product)
    } catch (error) {
      console.error(`Error parsing row ${i + 1}:`, error)
    }
  }
  
  return products
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

    const csvContent = await request.text()
    
    if (!csvContent || csvContent.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'CSV content is required' },
        { status: 400 }
      )
    }

    console.log('📊 Parsing CSV content...')
    const products = parseCSV(csvContent)
    
    if (products.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid products found in CSV' },
        { status: 400 }
      )
    }

    console.log(`✅ Parsed ${products.length} products from CSV`)

    const result: ImportResult = {
      success: 0,
      errors: 0,
      total: products.length,
      details: []
    }

    // Import products using the existing unified product service
    const { unifiedProductService } = await import('@/lib/unifiedProductService')
    const token = authHeader.replace('Bearer ', '')

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      
      try {
        // Validate required fields
        if (!product.name || !product.description || product.price <= 0) {
          result.details.push({
            row: i + 2, // +2 because CSV has header row
            product: product.name || 'Unknown',
            status: 'error',
            message: 'Missing required fields (name, description, or invalid price)'
          })
          result.errors++
          continue
        }

        // Create product data
        const productData = {
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription,
          price: product.price,
          stockQuantity: product.stockQuantity,
          categoryName: product.category,
          images: product.images,
          videos: product.videos,
          color: product.color || '',
          type: product.type || '',
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          tags: [product.color, product.type].filter(Boolean)
        }

        console.log(`📝 Creating product: ${product.name}`)
        
        // Create product using the unified product service
        const createdProduct = await unifiedProductService.createProductWithToken(productData, token)
        
        if (createdProduct) {
          result.details.push({
            row: i + 2,
            product: product.name,
            status: 'success',
            message: `Product created successfully with ID: ${createdProduct.id}`
          })
          result.success++
        } else {
          result.details.push({
            row: i + 2,
            product: product.name,
            status: 'error',
            message: 'Failed to create product - no response from service'
          })
          result.errors++
        }

      } catch (error) {
        console.error(`Error processing product ${product.name}:`, error)
        result.details.push({
          row: i + 2,
          product: product.name,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
        result.errors++
      }
    }

    return NextResponse.json({
      success: true,
      message: `CSV import completed. ${result.success} products imported successfully, ${result.errors} errors.`,
      data: result
    })

  } catch (error) {
    console.error('CSV import error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error during CSV import',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Generate CSV template
export async function GET(request: NextRequest) {
  try {
    const template = `name,price,description,shortDescription,category,color,type,images,videos,stockQuantity,isActive,isFeatured
"Red Rose",45500,"Beautiful red rose perfect for any occasion","Beautiful red rose perfect for any occasion",flowers,red,Rose,"/images/flowers/red-rose-1.jpg|/images/flowers/red-rose-2.jpg","/videos/red-rose-demo.mp4",10,true,false
"White Lily",39000,"Elegant white lily for special moments","Elegant white lily for special moments",flowers,white,Lily,"/images/flowers/white-lily-1.jpg","",10,true,false
"Pink Bouquet",52000,"Gorgeous pink bouquet for celebrations","Gorgeous pink bouquet for celebrations",birthday,pink,Bouquet,"/images/flowers/pink-bouquet-1.jpg|/images/flowers/pink-bouquet-2.jpg","",10,true,false`

    return new Response(template, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="product-import-template.csv"'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error generating CSV template' },
      { status: 500 }
    )
  }
}
