/**
 * Centralized product management service
 */

import { PrismaClient } from '@prisma/client'
import { generateSlug, generateUniqueSlug } from '../utils/slug'
import { validateProductData, sanitizeProductData, ValidationResult } from '../utils/validation'

const prisma = new PrismaClient()

export interface ProductCreateData {
  name: string
  description: string
  price: number
  stockQuantity: number
  categoryId: string
  images?: string[]
  isActive?: boolean
  isFeatured?: boolean
}

export interface ProductUpdateData extends Partial<ProductCreateData> {
  id: string
}

export interface ServiceResponse<T = any> {
  success: boolean
  data?: T
  message: string
  errors?: string[]
}

/**
 * Create a new product with proper validation and slug generation
 */
export async function createProduct(productData: ProductCreateData): Promise<ServiceResponse> {
  try {
    // Validate input data
    const validation = validateProductData(productData)
    if (!validation.isValid) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      }
    }

    // Sanitize data
    const sanitizedData = sanitizeProductData(productData)

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: sanitizedData.categoryId }
    })

    if (!category) {
      return {
        success: false,
        message: 'Category not found',
        errors: ['Invalid category ID provided']
      }
    }

    // Generate unique slug
    const baseSlug = generateSlug(sanitizedData.name)
    const existingProducts = await prisma.product.findMany({
      select: { slug: true }
    })
    const existingSlugs = existingProducts.map(p => p.slug)
    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs)

    // Create product
    const product = await prisma.product.create({
      data: {
        ...sanitizedData,
        slug: uniqueSlug
      },
      include: {
        category: true
      }
    })

    return {
      success: true,
      data: product,
      message: 'Product created successfully'
    }

  } catch (error) {
    console.error('Error creating product:', error)
    return {
      success: false,
      message: 'Failed to create product',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    }
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(productId: string, updateData: Partial<ProductCreateData>): Promise<ServiceResponse> {
  try {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!existingProduct) {
      return {
        success: false,
        message: 'Product not found',
        errors: ['Product with the given ID does not exist']
      }
    }

    // Validate update data if provided
    if (Object.keys(updateData).length > 0) {
      const validation = validateProductData({ ...existingProduct, ...updateData })
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        }
      }
    }

    // Sanitize update data
    const sanitizedData = sanitizeProductData(updateData)

    // Generate new slug if name is being updated
    let slug = existingProduct.slug
    if (sanitizedData.name && sanitizedData.name !== existingProduct.name) {
      const baseSlug = generateSlug(sanitizedData.name)
      const existingProducts = await prisma.product.findMany({
        select: { slug: true },
        where: { id: { not: productId } }
      })
      const existingSlugs = existingProducts.map(p => p.slug)
      slug = generateUniqueSlug(baseSlug, existingSlugs)
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...sanitizedData,
        slug
      },
      include: {
        category: true
      }
    })

    return {
      success: true,
      data: product,
      message: 'Product updated successfully'
    }

  } catch (error) {
    console.error('Error updating product:', error)
    return {
      success: false,
      message: 'Failed to update product',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    }
  }
}

/**
 * Get all products with pagination and filtering
 */
export async function getProducts(options: {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  status?: 'active' | 'inactive' | 'all'
} = {}): Promise<ServiceResponse> {
  try {
    const { page = 1, limit = 10, search, categoryId, status = 'all' } = options
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId
    }

    if (status !== 'all') {
      where.isActive = status === 'active'
    }

    // Get products and total count
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ])

    return {
      success: true,
      data: {
        products,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page
      },
      message: 'Products retrieved successfully'
    }

  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      success: false,
      message: 'Failed to fetch products',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    }
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(productId: string): Promise<ServiceResponse> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true }
    })

    if (!product) {
      return {
        success: false,
        message: 'Product not found',
        errors: ['Product with the given ID does not exist']
      }
    }

    return {
      success: true,
      data: product,
      message: 'Product retrieved successfully'
    }

  } catch (error) {
    console.error('Error fetching product:', error)
    return {
      success: false,
      message: 'Failed to fetch product',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    }
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string): Promise<ServiceResponse> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return {
        success: false,
        message: 'Product not found',
        errors: ['Product with the given ID does not exist']
      }
    }

    await prisma.product.delete({
      where: { id: productId }
    })

    return {
      success: true,
      message: 'Product deleted successfully'
    }

  } catch (error) {
    console.error('Error deleting product:', error)
    return {
      success: false,
      message: 'Failed to delete product',
      errors: [error instanceof Error ? error.message : 'Unknown error']
    }
  }
}
