import { Router } from 'express'

const router = Router()

/**
 * @swagger
 * /admin/products:
 *   get:
 *     summary: Get all products (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/products', (req, res) => {
  res.status(501).json({ message: 'Admin get products endpoint - Not implemented yet' })
})

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: Get all orders (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/orders', (req, res) => {
  res.status(501).json({ message: 'Admin get orders endpoint - Not implemented yet' })
})

export default router 