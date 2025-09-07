"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getFeaturedProducts = exports.getProductById = exports.getAllProducts = void 0;
const client_1 = require("@prisma/client");
const logger_1 = require("../utils/logger");
const prisma = new client_1.PrismaClient();
// Get all products with filtering and pagination
const getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit, categories, search, minPrice, maxPrice, featured, inStock } = req.query;
        const pageNum = parseInt(page) || 1;
        // If no limit specified or limit is invalid, get all products
        const limitNum = limit ? (parseInt(limit) || 1000) : 1000;
        const skip = (pageNum - 1) * limitNum;
        // Build where clause
        const where = {
            isActive: true
        };
        if (categories) {
            where.category = {
                slug: categories
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
        logger_1.logger.error('Failed to retrieve products', 'PRODUCT_CONTROLLER', { error: error instanceof Error ? error.message : 'Unknown error' }, error instanceof Error ? error : undefined);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getAllProducts = getAllProducts;
// Get products by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
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
        logger_1.logger.error('Failed to retrieve products', 'PRODUCT_CONTROLLER', { error: error instanceof Error ? error.message : 'Unknown error' }, error instanceof Error ? error : undefined);
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
            include: { category: true
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
// Create products (Admin only)
const createProduct = async (req, res) => {
    try {
        const { name, description, shortDescription, price, salePrice, costPrice, sku, stockQuantity, minStockAlert, categoryId, images, weight, dimensions, tags, isFeatured } = req.body;
        // Validate required fields
        if (!name || !price || !categoryId) {
            res.status(400).json({
                success: false,
                message: 'Name, price, and categories are required'
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
        // Validate numeric inputs
        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) {
            res.status(400).json({
                success: false,
                message: 'Invalid price value'
            });
            return;
        }
        const salePriceNum = salePrice ? parseFloat(salePrice) : null;
        if (salePrice && (isNaN(salePriceNum) || salePriceNum < 0)) {
            res.status(400).json({
                success: false,
                message: 'Invalid sale price value'
            });
            return;
        }
        const costPriceNum = costPrice ? parseFloat(costPrice) : null;
        if (costPrice && (isNaN(costPriceNum) || costPriceNum < 0)) {
            res.status(400).json({
                success: false,
                message: 'Invalid cost price value'
            });
            return;
        }
        const stockQuantityNum = parseInt(stockQuantity) || 0;
        if (isNaN(stockQuantityNum) || stockQuantityNum < 0) {
            res.status(400).json({
                success: false,
                message: 'Invalid stock quantity value'
            });
            return;
        }
        const minStockAlertNum = parseInt(minStockAlert) || 5;
        if (isNaN(minStockAlertNum) || minStockAlertNum < 0) {
            res.status(400).json({
                success: false,
                message: 'Invalid minimum stock alert value'
            });
            return;
        }
        const weightNum = weight ? parseFloat(weight) : null;
        if (weight && (isNaN(weightNum) || weightNum < 0)) {
            res.status(400).json({
                success: false,
                message: 'Invalid weight value'
            });
            return;
        }
        const product = await prisma.product.create({
            data: {
                name: name,
                slug: slug,
                description: description,
                shortDescription: shortDescription,
                price: priceNum,
                salePrice: salePriceNum,
                costPrice: costPriceNum,
                sku: sku,
                stockQuantity: stockQuantityNum,
                minStockAlert: minStockAlertNum,
                categoryId: categoryId,
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
        });
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to create product', 'PRODUCT_CONTROLLER', { error: error instanceof Error ? error.message : 'Unknown error' }, error instanceof Error ? error : undefined);
        // Handle specific error types
        if (error instanceof Error) {
            if (error.message.includes('Unique constraint')) {
                res.status(409).json({
                    success: false,
                    message: 'Product with this name already exists'
                });
                return;
            }
            if (error.message.includes('Foreign key constraint')) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid category ID provided'
                });
                return;
            }
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create product. Please try again.'
        });
    }
};
exports.createProduct = createProduct;
// Update products (Admin only)
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Check if products exists
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
        // Convert and validate numeric fields
        if (updateData.price) {
            const price = parseFloat(updateData.price);
            if (isNaN(price) || price < 0) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid price value'
                });
                return;
            }
            updateData.price = price;
        }
        if (updateData.salePrice) {
            const salePrice = parseFloat(updateData.salePrice);
            if (isNaN(salePrice) || salePrice < 0) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid sale price value'
                });
                return;
            }
            updateData.salePrice = salePrice;
        }
        if (updateData.costPrice) {
            const costPrice = parseFloat(updateData.costPrice);
            if (isNaN(costPrice) || costPrice < 0) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid cost price value'
                });
                return;
            }
            updateData.costPrice = costPrice;
        }
        if (updateData.stockQuantity) {
            const stockQuantity = parseInt(updateData.stockQuantity);
            if (isNaN(stockQuantity) || stockQuantity < 0) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid stock quantity value'
                });
                return;
            }
            updateData.stockQuantity = stockQuantity;
        }
        if (updateData.minStockAlert) {
            const minStockAlert = parseInt(updateData.minStockAlert);
            if (isNaN(minStockAlert) || minStockAlert < 0) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid minimum stock alert value'
                });
                return;
            }
            updateData.minStockAlert = minStockAlert;
        }
        if (updateData.weight) {
            const weight = parseFloat(updateData.weight);
            if (isNaN(weight) || weight < 0) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid weight value'
                });
                return;
            }
            updateData.weight = weight;
        }
        const product = await prisma.product.update({
            where: { id },
            data: updateData,
            include: { category: true
            }
        });
        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    }
    catch (error) {
        console.error('Update products error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateProduct = updateProduct;
// Delete products (Admin only)
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
        console.error('Delete products error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.deleteProduct = deleteProduct;
