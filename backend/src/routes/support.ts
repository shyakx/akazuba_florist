import express from 'express'
import { createSupportTicket } from '../controllers/supportController'

const router = express.Router()

/**
 * @swagger
 * /support/contact:
 *   post:
 *     summary: Create support ticket (public endpoint)
 *     tags: [Support]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerEmail
 *               - subject
 *               - message
 *             properties:
 *               customerName:
 *                 type: string
 *               customerEmail:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *                 default: MEDIUM
 *               orderId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Support ticket created successfully
 *       400:
 *         description: Bad request
 */
router.post('/contact', createSupportTicket)

export default router
