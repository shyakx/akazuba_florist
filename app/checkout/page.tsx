'use client'

import React, { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/RealAuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { ShoppingCart, CreditCard, Truck, MapPin, Phone, Mail, Upload, Camera, MessageCircle, User } from 'lucide-react'

const CheckoutPage = () => {
  const { state, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    customerName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    customerAddress: '',
    customerCity: 'Kigali',
    notes: '',
    paymentMethod: 'MOMO'
  })

  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate totals
  const subtotal = state.items.reduce((total, item) => total + ((item.product?.price || 0) * item.quantity), 0)
  const deliveryFee = formData.customerCity === 'Kigali' ? 2000 : 5000
  const totalAmount = subtotal + deliveryFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (JPG, PNG, etc.)')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }

      setPaymentProof(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPaymentProofPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Please sign in to complete your order')
      router.push('/login')
      return
    }

    if (state.items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    if (!paymentProof) {
      toast.error('Please upload payment proof before placing your order')
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData for file upload
      const orderFormData = new FormData()
      
      // Add order data
      orderFormData.append('orderData', JSON.stringify({
        ...formData,
        items: state.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.product?.price || 0,
          subtotal: (item.product?.price || 0) * item.quantity
        })),
        subtotal,
        deliveryFee,
        totalAmount
      }))
      
      // Add payment proof file
      orderFormData.append('paymentProof', paymentProof)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: orderFormData
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const result = await response.json()
      
      toast.success(`Order created successfully! Order #${result.order.orderNumber}`)
    clearCart()
      router.push(`/orders/${result.order.id}`)
    } catch (error) {
      console.error('Order creation error:', error)
      toast.error('Failed to create order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (state.items.length === 0) {
  return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-responsive">
          <div className="container-wide">
            <div className="text-center">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
              <p className="text-gray-600 mb-6">Add some beautiful flowers to your cart to get started!</p>
              <button
                onClick={() => router.push('/products')}
                className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Continue Shopping
              </button>
          </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-responsive">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order Summary
                </h2>
                
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product?.name || 'Product'}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">RWF {((item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>RWF {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>RWF {deliveryFee.toLocaleString()}</span>
      </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
                      <span>Total</span>
                      <span>RWF {totalAmount.toLocaleString()}</span>
                  </div>
                  </div>
                </div>
            </div>
          </div>

            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Customer Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                        <input
                          type="text"
                      name="customerName"
                      value={formData.customerName}
                          onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                        <input
                          type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                          onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                        <input
                          type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                          onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                      </label>
                    <select
                      name="customerCity"
                      value={formData.customerCity}
                          onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="Kigali">Kigali (RWF 2,000 delivery)</option>
                      <option value="Other">Other Cities (RWF 5,000 delivery)</option>
                    </select>
                  </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Address *
                      </label>
                      <textarea
                        name="customerAddress"
                        value={formData.customerAddress}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Enter your complete delivery address"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Payment Method
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method *
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="MOMO">Mobile Money (MoMo)</option>
                      <option value="BK">Bank of Kigali (BK)</option>
                    </select>
                  </div>
                    </div>

                    {/* Payment Instructions */}
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Payment Instructions
                      </h4>
                      
                      {formData.paymentMethod === 'MOMO' ? (
                        <div className="text-sm text-blue-800 space-y-2">
                          <p><strong>MTN MoMo Payment Steps:</strong></p>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>Dial <code className="bg-blue-100 px-1 rounded">*182*1*1*0784586110*{totalAmount}#</code></li>
                            <li>Enter your MoMo PIN when prompted</li>
                            <li>Confirm the payment</li>
                            <li>Take a screenshot of the payment confirmation</li>
                            <li>Upload the screenshot below</li>
                          </ol>
                          <p className="mt-2 text-xs">
                            <strong>Alternative:</strong> Send the payment screenshot directly to Diane&apos;s WhatsApp: <strong>0784 5861 10</strong>
                          </p>
                        </div>
                      ) : (
                        <div className="text-sm text-blue-800 space-y-2">
                          <p><strong>Bank of Kigali Transfer:</strong></p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Account Name: <strong>Umwali Diane</strong></li>
                            <li>Account Number: <strong>100161182448</strong></li>
                            <li>Bank: <strong>Bank of Kigali</strong></li>
                            <li>Amount: <strong>RWF {totalAmount.toLocaleString()}</strong></li>
                            <li>Reference: <strong>Your Name + Order</strong></li>
                          </ul>
                          <p className="mt-2 text-xs">
                            <strong>Alternative:</strong> Send the transfer receipt directly to Diane&apos;s WhatsApp: <strong>0784 5861 10</strong>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Proof Upload */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Upload className="w-5 h-5 mr-2" />
                      Payment Proof Upload
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Payment Screenshot/Receipt *
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-pink-400 transition-colors">
                          <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="payment-proof"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="payment-proof"
                                  name="payment-proof"
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handlePaymentProofChange}
                                  required
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Proof Preview */}
                      {paymentProofPreview && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Proof Preview:</h4>
                          <div className="relative inline-block">
                            <img
                              src={paymentProofPreview}
                              alt="Payment proof preview"
                              className="max-w-xs max-h-48 rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setPaymentProof(null)
                                setPaymentProofPreview(null)
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Any special instructions or notes for your order"
                    />
                  </div>

                      <button
                    type="submit"
                    disabled={isSubmitting || !paymentProof}
                    className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Place Order - RWF {totalAmount.toLocaleString()}
                      </>
                    )}
                    </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage 