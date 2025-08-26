"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/', auth_1.verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        let cart = await prisma.cart.findFirst({
            where: { userId },
            include: {
                cartItems: {
                    include: {
                        product: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            }
        });
        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId,
                    cartItems: {
                        create: []
                    }
                },
                include: {
                    cartItems: {
                        include: {
                            product: {
                                include: {
                                    category: true
                                }
                            }
                        }
                    }
                }
            });
        }
        res.json({
            success: true,
            message: 'Cart retrieved successfully',
            data: cart
        });
    }
    catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve cart'
        });
    }
});
router.post('/items', auth_1.verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and valid quantity are required'
            });
        }
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        let cart = await prisma.cart.findFirst({
            where: { userId }
        });
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId }
            });
        }
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        });
        let cartItem;
        if (existingItem) {
            cartItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
                include: {
                    product: {
                        include: {
                            category: true
                        }
                    }
                }
            });
        }
        else {
            cartItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity
                },
                include: {
                    product: {
                        include: {
                            category: true
                        }
                    }
                }
            });
        }
        res.json({
            success: true,
            message: 'Item added to cart successfully',
            data: cartItem
        });
        return;
    }
    catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add item to cart'
        });
        return;
    }
});
router.put('/items/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { quantity } = req.body;
        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid quantity is required'
            });
        }
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id,
                cart: {
                    userId
                }
            },
            include: {
                product: {
                    include: {
                        category: true
                    }
                }
            }
        });
        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }
        const updatedItem = await prisma.cartItem.update({
            where: { id },
            data: { quantity },
            include: {
                product: {
                    include: {
                        category: true
                    }
                }
            }
        });
        res.json({
            success: true,
            message: 'Cart item updated successfully',
            data: updatedItem
        });
        return;
    }
    catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update cart item'
        });
        return;
    }
});
router.delete('/items/:id', auth_1.verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id,
                cart: {
                    userId
                }
            }
        });
        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }
        await prisma.cartItem.delete({
            where: { id }
        });
        res.json({
            success: true,
            message: 'Item removed from cart successfully'
        });
        return;
    }
    catch (error) {
        console.error('Error removing cart item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove item from cart'
        });
        return;
    }
});
router.delete('/', auth_1.verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await prisma.cart.findFirst({
            where: { userId }
        });
        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
            await prisma.cart.delete({
                where: { id: cart.id }
            });
        }
        res.json({
            success: true,
            message: 'Cart cleared successfully'
        });
    }
    catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clear cart'
        });
    }
});
exports.default = router;
//# sourceMappingURL=cart.js.map