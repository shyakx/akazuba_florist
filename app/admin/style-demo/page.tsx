'use client'

import React from 'react'
import { Package, ShoppingCart, Tag, DollarSign, Plus, Edit, Trash2, Search, Filter, Eye, Download } from 'lucide-react'

export default function StyleDemo() {
  return (
    <>
      {/* Header */}
      <header>
        <h1>Admin Style Demo</h1>
        <p>Showcasing all the beautiful admin panel styles and components</p>
      </header>

      {/* Color Palette */}
      <section className="mb-6">
        <h3>Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="admin-card p-4 text-center">
            <div className="w-16 h-16 bg-[#6366f1] rounded-lg mx-auto mb-2"></div>
            <p className="font-semibold">Primary</p>
            <p className="text-sm text-gray-600">#6366f1</p>
          </div>
          <div className="admin-card p-4 text-center">
            <div className="w-16 h-16 bg-[#10b981] rounded-lg mx-auto mb-2"></div>
            <p className="font-semibold">Secondary</p>
            <p className="text-sm text-gray-600">#10b981</p>
          </div>
          <div className="admin-card p-4 text-center">
            <div className="w-16 h-16 bg-[#f59e0b] rounded-lg mx-auto mb-2"></div>
            <p className="font-semibold">Accent</p>
            <p className="text-sm text-gray-600">#f59e0b</p>
          </div>
          <div className="admin-card p-4 text-center">
            <div className="w-16 h-16 bg-[#ef4444] rounded-lg mx-auto mb-2"></div>
            <p className="font-semibold">Danger</p>
            <p className="text-sm text-gray-600">#ef4444</p>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="mb-6">
        <h3>Stats Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card">
            <Package />
            <div>
              <p>Total Products</p>
              <p>1,234</p>
            </div>
          </div>
          <div className="stat-card">
            <ShoppingCart />
            <div>
              <p>Total Orders</p>
              <p>567</p>
            </div>
          </div>
          <div className="stat-card">
            <Tag />
            <div>
              <p>Categories</p>
              <p>89</p>
            </div>
          </div>
          <div className="stat-card">
            <DollarSign />
            <div>
              <p>Revenue</p>
              <p>RWF 12.5M</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-6">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <button>
            <Plus />
            <h3>Add Product</h3>
            <p>Create new product listing</p>
          </button>
          <button>
            <Tag />
            <h3>Add Category</h3>
            <p>Create new category</p>
          </button>
          <button>
            <ShoppingCart />
            <h3>View Orders</h3>
            <p>Check customer orders</p>
          </button>
          <button>
            <DollarSign />
            <h3>Analytics</h3>
            <p>View sales reports</p>
          </button>
        </div>
      </section>

      {/* Forms */}
      <section className="mb-6">
        <h3>Form Elements</h3>
        <div className="admin-form">
          <h3>Product Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" placeholder="Enter product name" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select>
                <option>Select category</option>
                <option>Flowers</option>
                <option>Perfumes</option>
                <option>Gifts</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea placeholder="Enter product description"></textarea>
          </div>
          <div className="form-actions">
            <button className="btn btn-secondary">Cancel</button>
            <button className="btn btn-primary">Save Product</button>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="mb-6">
        <h3>Search and Filter</h3>
        <div className="search-filter-bar">
          <Search className="w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search products..." />
          <select>
            <option>All Categories</option>
            <option>Flowers</option>
            <option>Perfumes</option>
          </select>
          <Filter className="w-5 h-5 text-gray-400" />
          <select>
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <button>Apply Filters</button>
        </div>
      </section>

      {/* Tables */}
      <section className="mb-6">
        <h3>Data Tables</h3>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Red Rose Bouquet</td>
                <td>Flowers</td>
                <td>RWF 25,000</td>
                <td><span className="status-badge status-active">Active</span></td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-secondary"><Eye className="w-4 h-4" /></button>
                    <button className="btn btn-sm btn-primary"><Edit className="w-4 h-4" /></button>
                    <button className="btn btn-sm btn-danger"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Lavender Perfume</td>
                <td>Perfumes</td>
                <td>RWF 45,000</td>
                <td><span className="status-badge status-pending">Pending</span></td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-secondary"><Eye className="w-4 h-4" /></button>
                    <button className="btn btn-sm btn-primary"><Edit className="w-4 h-4" /></button>
                    <button className="btn btn-sm btn-danger"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Gift Basket</td>
                <td>Gifts</td>
                <td>RWF 35,000</td>
                <td><span className="status-badge status-inactive">Inactive</span></td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-sm btn-secondary"><Eye className="w-4 h-4" /></button>
                    <button className="btn btn-sm btn-primary"><Edit className="w-4 h-4" /></button>
                    <button className="btn btn-sm btn-danger"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-6">
        <h3>Button Variants</h3>
        <div className="flex flex-wrap gap-4">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-secondary">Secondary Button</button>
          <button className="btn btn-success">Success Button</button>
          <button className="btn btn-danger">Danger Button</button>
          <button className="btn btn-sm btn-primary">Small Button</button>
        </div>
      </section>

      {/* Alerts */}
      <section className="mb-6">
        <h3>Alert Messages</h3>
        <div className="space-y-4">
          <div className="alert alert-success">
            <strong>Success!</strong> Product has been saved successfully.
          </div>
          <div className="alert alert-warning">
            <strong>Warning!</strong> Please check your product information.
          </div>
          <div className="alert alert-danger">
            <strong>Error!</strong> Failed to save product. Please try again.
          </div>
          <div className="alert alert-info">
            <strong>Info!</strong> New features are available in the admin panel.
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-6">
        <h3>Card Components</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="admin-card">
            <div className="admin-card-header">
              <h4 className="font-semibold">Product Overview</h4>
            </div>
            <div className="admin-card-body">
              <p className="text-gray-600 mb-4">This is a sample product card with header, body, and footer sections.</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Package className="w-4 h-4" />
                <span>Category: Flowers</span>
              </div>
            </div>
            <div className="admin-card-footer">
              <button className="btn btn-primary btn-sm">View Details</button>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h4 className="font-semibold">Order Summary</h4>
            </div>
            <div className="admin-card-body">
              <p className="text-gray-600 mb-4">Order information and customer details displayed in a clean card format.</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ShoppingCart className="w-4 h-4" />
                <span>Order #12345</span>
              </div>
            </div>
            <div className="admin-card-footer">
              <button className="btn btn-secondary btn-sm">Download Invoice</button>
            </div>
          </div>
        </div>
      </section>

      {/* Loading States */}
      <section className="mb-6">
        <h3>Loading & Error States</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="loading-state">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p>Loading data...</p>
          </div>
          
          <div className="error-state">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h4>Something went wrong</h4>
            <p>Unable to load the requested data</p>
            <button className="btn btn-danger">Try Again</button>
          </div>
        </div>
      </section>
    </>
  )
}
