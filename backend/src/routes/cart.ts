import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get users cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const usersId = req.users.id

    // Get or create cart for users
    let cart = await prisma.cart.findFirst({
      where: { usersId },
      include: { cart_items: {
          include: { productss: {
              include: { categories: true
              }
            }
          }
        }
      }
    })

    if (!cart) {
      // Create new cart if doesn't exist
      cart = await prisma.cart.create({
        data: {
          usersId,
          cart_items: {
            create: []
          }
        },
        include: { cart_items: {
            include: { productss: {
                include: { categories: true
                }
              }
            }
          }
        }
      })
    }

    res.json({
      success: true,
      message: 'Cart retrieved successfully',
      data: cart
    })
  } catch (error) {
    console.error('Error getting cart:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve cart'
    })
  }
})

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productsId
 *               - quantity
 *             properties:
 *               productsId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/items', verifyToken, async (req, res) => {
  try {
    const usersId = req.users.id
    const { productsId, quantity } = req.body

    if (!productsId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and valid quantity are required'
      })
    }

    // Verify products exists
    const products = await prisma.products.findUnique({
      where: { id: productsId }
    })

    if (!products) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Get or create cart
    let cart = await prisma.cart.findFirst({
      where: { usersId }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: { usersId }
      })
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cart_items.findFirst({
      where: {
        cartId: cart.id,
        productsId
      }
    })

    let cartItem
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cart_items.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { productss: {
            include: { categories: true
            }
          }
        }
      })
    } else {
      // Add new item
      cartItem = await prisma.cart_items.create({
        data: {
          cartId: cart.id,
          productsId,
          quantity
        },
        include: { productss: {
            include: { categories: true
            }
          }
        }
      })
    }

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: cartItem
    })
    return
  } catch (error) {
    console.error('Error adding item to cart:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart'
    })
    return
  }
})

/**
 * @swagger
 * /cart/items/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.put('/items/:id', verifyToken, async (req, res) => {
  try {
    const usersId = req.users.id
    const { id } = req.params
    const { quantity } = req.body

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      })
    }

    // Verify cart item belongs to users
    const cartItem = await prisma.cart_items.findFirst({
      where: {
        id,
        cart: {
          usersId
        }
      },
      include: { productss: {
          include: { categories: true
          }
        }
      }
    })

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      })
    }

    const updatedItem = await prisma.cart_items.update({
      where: { id },
      data: { quantity },
      include: { productss: {
          include: { categories: true
          }
        }
      }
    })

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: updatedItem
    })
    return
  } catch (error) {
    console.error('Error updating cart item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item'
    })
    return
  }
})

/**
 * @swagger
 * /cart/items/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/items/:id', verifyToken, async (req, res) => {
  try {
    const usersId = req.users.id
    const { id } = req.params

    // Verify cart item belongs to users
    const cartItem = await prisma.cart_items.findFirst({
      where: {
        id,
        cart: {
          usersId
        }
      }
    })

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      })
    }

    await prisma.cart_items.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    })
    return
  } catch (error) {
    console.error('Error removing cart item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart'
    })
    return
  }
})

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/', verifyToken, async (req, res) => {
  try {
    const usersId = req.users.id

    const cart = await prisma.cart.findFirst({
      where: { usersId }
    })

    if (cart) {
      // Delete all cart items first
      await prisma.cart_items.deleteMany({
        where: { cartId: cart.id }
      })

      // Delete cart
      await prisma.cart.delete({
        where: { id: cart.id }
      })
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    })
  } catch (error) {
    console.error('Error clearing cart:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    })
  }
})

export default router 