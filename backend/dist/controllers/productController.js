"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getFeaturedProducts = exports.getProductById = exports.getAllProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all products with filtering and pagination
const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, search, minPrice, maxPrice, featured, inStock } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        // Build where clause
        const where = {
            isActive: true
        };
        if (category) {
            where.category = {
                slug: category
            };
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { shortDescription: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice)
                where.price.gte = parseFloat(minPrice);
            if (maxPrice)
                where.price.lte = parseFloat(maxPrice);
        }
        if (featured === 'true') {
            where.isFeatured = true;
        }
        if (inStock === 'true') {
            where.stockQuantity = {
                gt: 0
            };
        }
        // Get products with category
        const products = await prisma.product.findMany({
            where,
            include: {
                category: true
            },
            skip,
            take: limitNum,
            orderBy: {
                createdAt: 'desc'
            }
        });
        // Get total count for pagination
        const total = await prisma.product.count({ where });
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
        });
    }
    catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getAllProducts = getAllProducts;
// Get product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
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
        });
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Product retrieved successfully',
            data: product
        });
    }
    catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getProductById = getProductById;
// Get featured products
const getFeaturedProducts = async (req, res) => {
    try {
        const { limit = 8 } = req.query;
        const limitNum = parseInt(limit);
        const products = await prisma.product.findMany({
            where: {
                isActive: true,
                isFeatured: true
            },
            include: {
                category: true
            },
            take: limitNum,
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json({
            success: true,
            message: 'Featured products retrieved successfully',
            data: products
        });
    }
    catch (error) {
        console.error('Get featured products error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getFeaturedProducts = getFeaturedProducts;
// Create product (Admin only)
const createProduct = async (req, res) => {
    try {
        const { name, description, shortDescription, price, salePrice, costPrice, sku, stockQuantity, minStockAlert, categoryId, images, weight, dimensions, tags, isFeatured } = req.body;
        // Validate required fields
        if (!name || !price || !categoryId) {
            res.status(400).json({
                success: false,
                message: 'Name, price, and category are required'
            });
            return;
        }
        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        // Check if product with same slug exists
        const existingProduct = await prisma.product.findUnique({
            where: { slug }
        });
        if (existingProduct) {
            res.status(400).json({
                success: false,
                message: 'Product with this name already exists'
            });
            return;
        }
        const product = await prisma.product.create({
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
                category: true
            }
        });
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    }
    catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.createProduct = createProduct;
// Update product (Admin only)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });
        if (!existingProduct) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }
        // Generate new slug if name changed
        if (updateData.name && updateData.name !== existingProduct.name) {
            const slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            // Check if new slug conflicts
            const slugConflict = await prisma.product.findUnique({
                where: { slug }
            });
            if (slugConflict && slugConflict.id !== id) {
                res.status(400).json({
                    success: false,
                    message: 'Product with this name already exists'
                });
                return;
            }
            updateData.slug = slug;
        }
        // Convert numeric fields
        if (updateData.price)
            updateData.price = parseFloat(updateData.price);
        if (updateData.salePrice)
            updateData.salePrice = parseFloat(updateData.salePrice);
        if (updateData.costPrice)
            updateData.costPrice = parseFloat(updateData.costPrice);
        if (updateData.stockQuantity)
            updateData.stockQuantity = parseInt(updateData.stockQuantity);
        if (updateData.minStockAlert)
            updateData.minStockAlert = parseInt(updateData.minStockAlert);
        if (updateData.weight)
            updateData.weight = parseFloat(updateData.weight);
        const product = await prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                category: true
            }
        });
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    }
    catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateProduct = updateProduct;
// Delete product (Admin only)
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });
        if (!existingProduct) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }
        // Soft delete by setting isActive to false
        await prisma.product.update({
            where: { id },
            data: { isActive: false }
        });
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.deleteProduct = deleteProduct;
