import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { logger } from '../../lib/logger'

const prisma = new PrismaClient()

// Get all products with filtering and pagination
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit,
      categories,
      search,
      minPrice,
      maxPrice,
      featured,
      inStock
    } = req.query

    const pageNum = parseInt(page as string) || 1
    // If no limit specified or limit is invalid, get all products
    const limitNum = limit ? (parseInt(limit as string) || 1000) : 1000
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const where: any = {
      isActive: true
    }

    if (categories) {
      where.categories = {
        slug: categories
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { shortDescription: { contains: search as string, mode: 'insensitive' } }
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice as string)
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string)
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    if (inStock === 'true') {
      where.stockQuantity = {
        gt: 0
      }
    }

    // Get products with categories (optimized query)
    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        shortDescription: true,
        price: true,
        salePrice: true,
        images: true,
        isActive: true,
        isFeatured: true,
        stockQuantity: true,
        createdAt: true,
        categories: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      skip: limitNum === 1000 ? 0 : skip, // Skip pagination if getting all products
      take: limitNum,
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Get total count for pagination
    const total = await prisma.product.count({ where })

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    })
  } catch (error) {
    logger.error('Failed to retrieve products', 'PRODUCT_CONTROLLER', { error: error instanceof Error ? error.message : 'Unknown error' }, error instanceof Error ? error : undefined)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Get products by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const products = await prisma.product.findUnique({
      where: { id },
      include: { categories: true,
        reviews: {
          include: { users: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          where: {
            isApproved: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!products) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      })
      return
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: products
    })
  } catch (error) {
    logger.error('Failed to retrieve products', 'PRODUCT_CONTROLLER', { error: error instanceof Error ? error.message : 'Unknown error' }, error instanceof Error ? error : undefined)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Get featured products
export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 8 } = req.query
    const limitNum = parseInt(limit as string)

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true
      },
      include: { categories: true
      },
      take: limitNum,
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({
      success: true,
      message: 'Featured products retrieved successfully',
      data: products
    })
  } catch (error) {
    console.error('Get featured products error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Create products (Admin only)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      salePrice,
      costPrice,
      sku,
      stockQuantity,
      minStockAlert,
      categoryId,
      images,
      weight,
      dimensions,
      tags,
      isFeatured
    } = req.body

    // Validate required fields
    if (!name || !price || !categoryId) {
      res.status(400).json({
        success: false,
        message: 'Name, price, and categories are required'
      })
      return
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check if products with same slug exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    })

    if (existingProduct) {
      res.status(400).json({
        success: false,
        message: 'Product with this name already exists'
      })
      return
    }

    const products = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        sku,
        stockQuantity: parseInt(stockQuantity) || 0,
        minStockAlert: parseInt(minStockAlert) || 5,
        categoryId,
        images: images || [],
        weight: weight ? parseFloat(weight) : null,
        dimensions: dimensions || null,
        tags: tags || [],
        isFeatured: isFeatured || false,
        isActive: true
      },
      include: { 
        categories: true 
      }
    })

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: products
    })
  } catch (error) {
    logger.error('Failed to create product', 'PRODUCT_CONTROLLER', { error: error instanceof Error ? error.message : 'Unknown error' }, error instanceof Error ? error : undefined)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        res.status(409).json({
          success: false,
          message: 'Product with this name already exists'
        })
        return
      }
      
      if (error.message.includes('Foreign key constraint')) {
        res.status(400).json({
          success: false,
          message: 'Invalid category ID provided'
        })
        return
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create product. Please try again.'
    })
  }
}

// Update products (Admin only)
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Check if products exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      })
      return
    }

    // Generate new slug if name changed
    if (updateData.name && updateData.name !== existingProduct.name) {
      const slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      
      // Check if new slug conflicts
      const slugConflict = await prisma.product.findUnique({
        where: { slug }
      })

      if (slugConflict && slugConflict.id !== id) {
        res.status(400).json({
          success: false,
          message: 'Product with this name already exists'
        })
        return
      }

      updateData.slug = slug
    }

    // Convert numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price)
    if (updateData.salePrice) updateData.salePrice = parseFloat(updateData.salePrice)
    if (updateData.costPrice) updateData.costPrice = parseFloat(updateData.costPrice)
    if (updateData.stockQuantity) updateData.stockQuantity = parseInt(updateData.stockQuantity)
    if (updateData.minStockAlert) updateData.minStockAlert = parseInt(updateData.minStockAlert)
    if (updateData.weight) updateData.weight = parseFloat(updateData.weight)

    const products = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { categories: true
      }
    })

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: products
    })
  } catch (error) {
    console.error('Update products error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Delete products (Admin only)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    // Check if products exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      })
      return
    }

    // Soft delete by setting isActive to false
    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    })

    res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Delete products error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
} 