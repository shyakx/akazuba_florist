'use client'

import React, { useState } from 'react'
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, Receipt } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useCart } from '@/contexts/CartContext'
import PaymentModal from '@/components/PaymentModal'
import Footer from '@/components/Footer'

const CheckoutPage = () => {
  const { state, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    deliveryDate: '',
    deliveryTime: '',
    paymentMethod: '',
    specialInstructions: ''
  })

  const deliveryFee = state.total >= 50000 ? 0 : 2000
  const total = state.total + deliveryFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleNext = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName || !formData.phone || !formData.address)) {
      toast.error('Please fill in all required fields')
      return
    }
    if (step === 2 && !formData.paymentMethod) {
      toast.error('Please select a payment method')
      return
    }
    setStep(step + 1)
  }

  const handlePaymentSuccess = (paymentInfo: any) => {
    setPaymentDetails(paymentInfo)
    
    // Create order details
    const orderInfo = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      items: state.items,
      total: total,
      payment: paymentInfo,
      shipping: {
        name: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        specialInstructions: formData.specialInstructions
      },
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
    
    setOrderDetails(orderInfo)
    
    // Clear cart after successful payment
    clearCart()
    
    // Move to confirmation step
    setStep(4)
    setIsPaymentModalOpen(false)
    
    toast.success('Order placed successfully! You will receive a confirmation shortly.')
  }

  const handlePlaceOrder = () => {
    if (!formData.paymentMethod) {
      toast.error('Please select a payment method')
      return
    }
    
    setIsPaymentModalOpen(true)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-8">
            <Link href="/cart" className="flex items-center text-gray-600 hover:text-pink-600 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Checkout
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete your order and we&apos;ll deliver beautiful flowers to your doorstep.
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= stepNumber 
                      ? 'bg-pink-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? 'bg-pink-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="card p-8">
                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                        <input
                          type="date"
                          name="deliveryDate"
                          value={formData.deliveryDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                        <textarea
                          name="specialInstructions"
                          value={formData.specialInstructions}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Any special delivery instructions..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                    <div className="space-y-4">
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="momo"
                          checked={formData.paymentMethod === 'momo'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <Smartphone className="h-6 w-6 text-green-600 mr-3" />
                          <div>
                            <div className="font-medium">Mobile Money (MoMo)</div>
                            <div className="text-sm text-gray-500">Pay with your mobile money account</div>
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bk"
                          checked={formData.paymentMethod === 'bk'}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
                          <div>
                            <div className="font-medium">Bank Transfer (BK)</div>
                            <div className="text-sm text-gray-500">Pay via bank transfer</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review Order</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700">
                            {formData.firstName} {formData.lastName}<br />
                            {formData.address}<br />
                            {formData.city && `${formData.city}, `}Rwanda<br />
                            Phone: {formData.phone}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700 capitalize">
                            {formData.paymentMethod === 'momo' ? 'Mobile Money (MoMo)' : 'Bank Transfer (BK)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && orderDetails && (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Confirmed!</h2>
                    <p className="text-gray-600 mb-6">
                      Thank you for your order. We&apos;ll send you a confirmation email with tracking details.
                    </p>
                    
                    {/* Order Details */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                        <div className="flex items-center space-x-2">
                          <Receipt className="h-5 w-5 text-pink-600" />
                          <span className="text-sm font-medium text-pink-600">{orderDetails.id}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-medium">
                            {paymentDetails?.method === 'momo' ? 'Mobile Money' : 'Bank Transfer'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Reference:</span>
                          <span className="font-medium">{paymentDetails?.reference}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-bold text-pink-600">{formatPrice(orderDetails.total)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Link href="/" className="btn-primary">
                      Continue Shopping
                    </Link>
                  </div>
                )}

                {step < 4 && (
                  <div className="mt-8 flex justify-between">
                    {step > 1 && (
                      <button
                        onClick={() => setStep(step - 1)}
                        className="btn-outline"
                      >
                        Previous
                      </button>
                    )}
                    <button
                      onClick={step === 3 ? handlePlaceOrder : handleNext}
                      className="btn-primary ml-auto"
                    >
                      {step === 3 ? 'Place Order' : 'Next'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-8 sticky top-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {state.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">{formatPrice(state.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery</span>
                      <span className="font-semibold">
                        {deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-pink-600">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        amount={total}
        paymentMethod={formData.paymentMethod as 'momo' | 'bk'}
        customerEmail={formData.email}
        customerName={`${formData.firstName} ${formData.lastName}`}
      />

      <Footer />
    </div>
  )
}

export default CheckoutPage 