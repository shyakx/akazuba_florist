import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'

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

    // Build where clause - show all products (treating all as active)
    const where: any = {
      // Remove isActive filter to show all products
    }

    if (categories) {
      where.category = {
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
        category: {
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

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true,
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

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      })
      return
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
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
      include: { category: true
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

    // Check if product with same slug exists
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

    // Validate numeric inputs
    const priceNum = parseFloat(price)
    if (isNaN(priceNum) || priceNum < 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid price value'
      })
      return
    }

    const salePriceNum = salePrice ? parseFloat(salePrice) : null
    if (salePrice && (isNaN(salePriceNum!) || salePriceNum! < 0)) {
      res.status(400).json({
        success: false,
        message: 'Invalid sale price value'
      })
      return
    }

    const costPriceNum = costPrice ? parseFloat(costPrice) : null
    if (costPrice && (isNaN(costPriceNum!) || costPriceNum! < 0)) {
      res.status(400).json({
        success: false,
        message: 'Invalid cost price value'
      })
      return
    }

    const stockQuantityNum = parseInt(stockQuantity) || 0
    if (isNaN(stockQuantityNum) || stockQuantityNum < 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid stock quantity value'
      })
      return
    }

    const minStockAlertNum = parseInt(minStockAlert) || 5
    if (isNaN(minStockAlertNum) || minStockAlertNum < 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid minimum stock alert value'
      })
      return
    }

    const weightNum = weight ? parseFloat(weight) : null
    if (weight && (isNaN(weightNum!) || weightNum! < 0)) {
      res.status(400).json({
        success: false,
        message: 'Invalid weight value'
      })
      return
    }

    const product = await prisma.product.create({
      data: {
        name: name as string,
        slug: slug as string,
        description: description as string,
        shortDescription: shortDescription as string,
        price: priceNum,
        salePrice: salePriceNum,
        costPrice: costPriceNum,
        sku: sku as string,
        stockQuantity: stockQuantityNum,
        minStockAlert: minStockAlertNum,
        categoryId: categoryId as string,
        images: images || [],
        weight: weightNum,
        dimensions: dimensions || null,
        tags: tags || [],
        isFeatured: isFeatured || false,
        isActive: true,
        updatedAt: new Date()
      },
      include: { 
        category: true 
      }
    })

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
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

    // Convert and validate numeric fields
    if (updateData.price) {
      const price = parseFloat(updateData.price)
      if (isNaN(price) || price < 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid price value'
        })
        return
      }
      updateData.price = price
    }
    
    if (updateData.salePrice) {
      const salePrice = parseFloat(updateData.salePrice)
      if (isNaN(salePrice) || salePrice < 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid sale price value'
        })
        return
      }
      updateData.salePrice = salePrice
    }
    
    if (updateData.costPrice) {
      const costPrice = parseFloat(updateData.costPrice)
      if (isNaN(costPrice) || costPrice < 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid cost price value'
        })
        return
      }
      updateData.costPrice = costPrice
    }
    
    if (updateData.stockQuantity) {
      const stockQuantity = parseInt(updateData.stockQuantity)
      if (isNaN(stockQuantity) || stockQuantity < 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid stock quantity value'
        })
        return
      }
      updateData.stockQuantity = stockQuantity
    }
    
    if (updateData.minStockAlert) {
      const minStockAlert = parseInt(updateData.minStockAlert)
      if (isNaN(minStockAlert) || minStockAlert < 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid minimum stock alert value'
        })
        return
      }
      updateData.minStockAlert = minStockAlert
    }
    
    if (updateData.weight) {
      const weight = parseFloat(updateData.weight)
      if (isNaN(weight) || weight < 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid weight value'
        })
        return
      }
      updateData.weight = weight
    }

    // Ensure all products are always active
    updateData.isActive = true
    
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true
      }
    })

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
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

    // Check if product exists
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

    // Hard delete - actually remove from database
    // First delete related records to avoid foreign key constraints
    await prisma.$transaction(async (tx) => {
      // Delete cart items that reference this product
      await tx.cart_items.deleteMany({
        where: { productId: id }
      })
      
      // Delete order items that reference this product
      await tx.order_items.deleteMany({
        where: { productId: id }
      })
      
      // Delete reviews that reference this product (already has onDelete: Cascade)
      await tx.reviews.deleteMany({
        where: { productId: id }
      })
      
      // Delete wishlist items that reference this product (already has onDelete: Cascade)
      await tx.wishlist.deleteMany({
        where: { productId: id }
      })
      
      // Finally delete the product
      await tx.product.delete({
        where: { id }
      })
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