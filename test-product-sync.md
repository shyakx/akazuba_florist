# Product Deletion Sync Test

## Test Scenario
Verify that when a product is deleted in the admin panel, it's also removed from the customer view.

## Steps to Test

### 1. Start the Application
```bash
npm run dev
```

### 2. Open Two Browser Windows
- **Window 1**: Admin panel (`http://localhost:3000/admin/products`)
- **Window 2**: Customer view (`http://localhost:3000/products`)

### 3. Verify Initial State
- Both windows should show the same products (fallback data)
- Note the product count in both views

### 4. Delete a Product in Admin
1. In admin window, click the trash icon on any product
2. Confirm deletion
3. Verify the product disappears from admin view
4. Check browser console for logs:
   - `🗑️ Deleting product via unified service: [product-id]`
   - `✅ Product deleted successfully from backend`
   - `🔄 Refreshing products via unified service...`

### 5. Verify Customer View Updates
1. Switch to customer window
2. Check if the deleted product is gone
3. Check browser console for logs:
   - `🔄 Admin product deleted, refreshing customer data`
   - `🔄 Force refreshing customer data...`
   - `✅ Products loaded via unified service: [count]`

### 6. Test Backend Offline Scenario
1. Stop the backend server
2. Try to delete a product in admin
3. Verify:
   - Product is NOT removed from admin view
   - Error message is shown
   - Customer view remains unchanged

### 7. Test Backend Online Again
1. Start the backend server
2. Verify both views sync properly again

## Expected Results

### ✅ Success Criteria
- Product deletion in admin immediately reflects in customer view
- Both views always show the same product list
- Backend offline scenarios are handled gracefully
- No duplicate products or stale data

### ❌ Failure Indicators
- Product deleted in admin but still visible in customer view
- Different product counts between admin and customer
- Backend errors not handled properly
- Cache invalidation not working

## Debug Information

### Console Logs to Look For
```
Admin Context:
- 🔄 Refreshing products via unified service...
- ✅ Products loaded via unified service: X
- 🗑️ Deleting product via unified service: [id]
- ✅ Product deleted successfully from backend

Customer Context:
- 🔄 Loading products via unified service
- ✅ Products loaded via unified service: X
- 🗑️ Admin product deleted, refreshing customer data
- 🔄 Force refreshing customer data...
```

### Network Requests
- Admin: `GET /api/products` (unified endpoint)
- Customer: `GET /api/products` (same unified endpoint)
- Delete: `DELETE /api/products/[id]` (unified endpoint)

## Notes
- Both admin and customer now use the same `unifiedProductService`
- Cache is automatically invalidated after operations
- Fallback data is identical in both contexts
- Event system ensures real-time sync
