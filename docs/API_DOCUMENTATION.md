# API Documentation

## Overview
This document provides comprehensive documentation for the Akazuba Florist e-commerce API endpoints.

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## Authentication
Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Error Responses
All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Endpoints

### Products

#### GET /api/products
Retrieve all products with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Number of products per page (default: 1000)
- `search` (string): Search term for product name/description
- `categories` (string): Filter by category slug
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `featured` (boolean): Filter featured products only
- `inStock` (boolean): Filter in-stock products only

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "price": "number",
      "salePrice": "number",
      "images": ["string"],
      "isActive": "boolean",
      "isFeatured": "boolean",
      "stockQuantity": "number",
      "categories": {
        "id": "string",
        "name": "string",
        "slug": "string"
      }
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "pages": "number"
  }
}
```

#### GET /api/products/:id
Retrieve a specific product by ID.

**Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "description": "string",
    "shortDescription": "string",
    "price": "number",
    "salePrice": "number",
    "costPrice": "number",
    "sku": "string",
    "stockQuantity": "number",
    "minStockAlert": "number",
    "images": ["string"],
    "isActive": "boolean",
    "isFeatured": "boolean",
    "weight": "number",
    "dimensions": "object",
    "tags": ["string"],
    "createdAt": "string",
    "updatedAt": "string",
    "categories": {
      "id": "string",
      "name": "string",
      "slug": "string"
    }
  }
}
```

#### POST /api/products
Create a new product (Admin only).

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "shortDescription": "string",
  "price": "number",
  "salePrice": "number",
  "costPrice": "number",
  "sku": "string",
  "stockQuantity": "number",
  "minStockAlert": "number",
  "categoryId": "string",
  "images": ["string"],
  "weight": "number",
  "dimensions": "object",
  "tags": ["string"],
  "isFeatured": "boolean"
}
```

### Categories

#### GET /api/categories
Retrieve all active categories.

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "image": "string",
      "isActive": "boolean",
      "sortOrder": "number",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

### Orders

#### POST /api/orders
Create a new order.

**Request Body:**
```json
{
  "customerName": "string",
  "customerEmail": "string",
  "customerPhone": "string",
  "customerAddress": "string",
  "customerCity": "string",
  "items": [
    {
      "productId": "string",
      "name": "string",
      "image": "string",
      "sku": "string",
      "quantity": "number",
      "price": "number",
      "color": "string",
      "type": "string"
    }
  ],
  "paymentMethod": "string",
  "notes": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "string",
    "orderNumber": "string",
    "status": "PENDING",
    "totalAmount": "number",
    "createdAt": "string"
  }
}
```

### Authentication

#### POST /api/auth/login
User login.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "string"
    },
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

#### POST /api/auth/register
User registration.

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

## Rate Limiting
API endpoints are rate-limited to prevent abuse:
- General endpoints: 100 requests per minute
- Authentication endpoints: 10 requests per minute
- Admin endpoints: 200 requests per minute

## Caching
Many endpoints implement caching for improved performance:
- Product listings: 5 minutes
- Category data: 10 minutes
- User data: 2 minutes

## Webhooks
The API supports webhooks for order status changes:
- `order.created`
- `order.updated`
- `order.completed`
- `order.cancelled`

## SDK Examples

### JavaScript/TypeScript
```typescript
import { AkazubaAPI } from '@akazuba/api-client'

const api = new AkazubaAPI({
  baseURL: 'https://api.akazuba.com',
  apiKey: 'your-api-key'
})

// Get products
const products = await api.products.getAll({
  page: 1,
  limit: 20,
  featured: true
})

// Create order
const order = await api.orders.create({
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  items: [{
    productId: 'prod_123',
    quantity: 2,
    price: 25.99
  }]
})
```

### cURL Examples
```bash
# Get products
curl -X GET "https://api.akazuba.com/products?featured=true&limit=10" \
  -H "Authorization: Bearer your-token"

# Create order
curl -X POST "https://api.akazuba.com/orders" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "items": [{"productId": "prod_123", "quantity": 1, "price": 25.99}]
  }'
```

## Support
For API support and questions:
- Email: api-support@akazuba.com
- Documentation: https://docs.akazuba.com
- Status Page: https://status.akazuba.com
