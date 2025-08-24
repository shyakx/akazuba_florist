import { Router } from 'express'

const router = Router()

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', (req, res) => {
  res.status(501).json({ message: 'Get cart endpoint - Not implemented yet' })
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
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/items', (req, res) => {
  res.status(501).json({ message: 'Add item to cart endpoint - Not implemented yet' })
})

export default router 