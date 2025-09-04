import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get all categories
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                isActive: true
              }
            }
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })

    res.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories
    })
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Get categories by ID
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const categories = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: {
            isActive: true
          },
          include: { categories: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            products: {
              where: {
                isActive: true
              }
            }
          }
        }
      }
    })

    if (!categories) {
      res.status(404).json({
        success: false,
        message: 'Category not found'
      })
      return
    }

    res.json({
      success: true,
      message: 'Category retrieved successfully',
      data: categories
    })
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Get categories by slug
export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params

    const categories = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: {
            isActive: true
          },
          include: { categories: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            products: {
              where: {
                isActive: true
              }
            }
          }
        }
      }
    })

    if (!categories) {
      res.status(404).json({
        success: false,
        message: 'Category not found'
      })
      return
    }

    res.json({
      success: true,
      message: 'Category retrieved successfully',
      data: categories
    })
  } catch (error) {
    console.error('Get categories by slug error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Create categories (Admin only)
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, imageUrl, sortOrder } = req.body

    // Validate required fields
    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Category name is required'
      })
      return
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check if categories with same slug exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      })
      return
    }

    const categories = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        sortOrder: parseInt(sortOrder) || 0,
        isActive: true
      }
    })

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: categories
    })
  } catch (error) {
    console.error('Create categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Update categories (Admin only)
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Check if categories exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      res.status(404).json({
        success: false,
        message: 'Category not found'
      })
      return
    }

    // Generate new slug if name changed
    if (updateData.name && updateData.name !== existingCategory.name) {
      const slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      
      // Check if new slug conflicts
      const slugConflict = await prisma.category.findUnique({
        where: { slug }
      })

      if (slugConflict && slugConflict.id !== id) {
        res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        })
        return
      }

      updateData.slug = slug
    }

    // Convert numeric fields
    if (updateData.sortOrder) updateData.sortOrder = parseInt(updateData.sortOrder)

    const categories = await prisma.category.update({
      where: { id },
      data: updateData
    })

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: categories
    })
  } catch (error) {
    console.error('Update categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

// Delete categories (Admin only)
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    // Check if categories exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    if (!existingCategory) {
      res.status(404).json({
        success: false,
        message: 'Category not found'
      })
      return
    }

    // Check if categories has products
    if (existingCategory._count.products > 0) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete categories with existing products'
      })
      return
    }

    // Soft delete by setting isActive to false
    await prisma.category.update({
      where: { id },
      data: { isActive: false }
    })

    res.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Delete categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
} 