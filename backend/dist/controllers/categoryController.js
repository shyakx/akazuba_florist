"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryBySlug = exports.getCategoryById = exports.getAllCategories = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all categories
const getAllCategories = async (req, res) => {
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
        });
        res.json({
            success: true,
            message: 'Categories retrieved successfully',
            data: categories
        });
    }
    catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getAllCategories = getAllCategories;
// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                products: {
                    where: {
                        isActive: true
                    },
                    include: {
                        category: true
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
        });
        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Category not found'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Category retrieved successfully',
            data: category
        });
    }
    catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getCategoryById = getCategoryById;
// Get category by slug
const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                products: {
                    where: {
                        isActive: true
                    },
                    include: {
                        category: true
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
        });
        if (!category) {
            res.status(404).json({
                success: false,
                message: 'Category not found'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Category retrieved successfully',
            data: category
        });
    }
    catch (error) {
        console.error('Get category by slug error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getCategoryBySlug = getCategoryBySlug;
// Create category (Admin only)
const createCategory = async (req, res) => {
    try {
        const { name, description, imageUrl, sortOrder } = req.body;
        // Validate required fields
        if (!name) {
            res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
            return;
        }
        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        // Check if category with same slug exists
        const existingCategory = await prisma.category.findUnique({
            where: { slug }
        });
        if (existingCategory) {
            res.status(400).json({
                success: false,
                message: 'Category with this name already exists'
            });
            return;
        }
        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description,
                imageUrl,
                sortOrder: parseInt(sortOrder) || 0,
                isActive: true
            }
        });
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    }
    catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.createCategory = createCategory;
// Update category (Admin only)
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Check if category exists
        const existingCategory = await prisma.category.findUnique({
            where: { id }
        });
        if (!existingCategory) {
            res.status(404).json({
                success: false,
                message: 'Category not found'
            });
            return;
        }
        // Generate new slug if name changed
        if (updateData.name && updateData.name !== existingCategory.name) {
            const slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            // Check if new slug conflicts
            const slugConflict = await prisma.category.findUnique({
                where: { slug }
            });
            if (slugConflict && slugConflict.id !== id) {
                res.status(400).json({
                    success: false,
                    message: 'Category with this name already exists'
                });
                return;
            }
            updateData.slug = slug;
        }
        // Convert numeric fields
        if (updateData.sortOrder)
            updateData.sortOrder = parseInt(updateData.sortOrder);
        const category = await prisma.category.update({
            where: { id },
            data: updateData
        });
        res.json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    }
    catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.updateCategory = updateCategory;
// Delete category (Admin only)
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if category exists
        const existingCategory = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        products: true
                    }
                }
            }
        });
        if (!existingCategory) {
            res.status(404).json({
                success: false,
                message: 'Category not found'
            });
            return;
        }
        // Check if category has products
        if (existingCategory._count.products > 0) {
            res.status(400).json({
                success: false,
                message: 'Cannot delete category with existing products'
            });
            return;
        }
        // Soft delete by setting isActive to false
        await prisma.category.update({
            where: { id },
            data: { isActive: false }
        });
        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.deleteCategory = deleteCategory;
