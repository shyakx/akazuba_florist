import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get users wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId },
      include: { products: {
          include: { category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({
      success: true,
      message: 'Wishlist retrieved successfully',
      data: wishlistItems
    })
  } catch (error) {
    console.error('Error getting wishlist:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve wishlist'
    })
  }
})

/**
 * @swagger
 * /wishlist:
 *   post:
 *     summary: Add item to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item added to wishlist successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      })
    }

    // Verify products exists
    const products = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!products) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Check if item already exists in wishlist
    const existingItem = await prisma.wishlist.findFirst({
      where: {
        userId,
        productId
      }
    })

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Item already exists in wishlist'
      })
    }

    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        productId
      } as any,
      include: { products: {
          include: { category: true
          }
        }
      }
    }) as any

    res.json({
      success: true,
      message: 'Item added to wishlist successfully',
      data: wishlistItem
    })
    return
  } catch (error) {
    console.error('Error adding item to wishlist:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add item to wishlist'
    })
    return
  }
})

/**
 * @swagger
 * /wishlist/{id}:
 *   delete:
 *     summary: Remove item from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    // Verify wishlist item belongs to users
    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        id,
        userId
      }
    })

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found'
      })
    }

    await prisma.wishlist.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Item removed from wishlist successfully'
    })
    return
  } catch (error) {
    console.error('Error removing wishlist item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from wishlist'
    })
    return
  }
})

/**
 * @swagger
 * /wishlist:
 *   delete:
 *     summary: Clear wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id

    await prisma.wishlist.deleteMany({
      where: { userId }
    })

    res.json({
      success: true,
      message: 'Wishlist cleared successfully'
    })
  } catch (error) {
    console.error('Error clearing wishlist:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist'
    })
  }
})

export default router 