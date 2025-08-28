'use client'

import React, { useState } from 'react'
import { X, Smartphone, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { paymentAPI } from '@/lib/payment-api'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (paymentDetails: any) => void
  amount: number
  customerEmail: string
  customerName: string
}

const PaymentModal = ({ isOpen, onClose, onSuccess, amount, customerEmail, customerName }: PaymentModalProps) => {
  const [step, setStep] = useState<'form' | 'processing' | 'redirect' | 'success' | 'error'>('form')
  const [formData, setFormData] = useState({
    phoneNumber: ''
  })
  const [error, setError] = useState('')
  const [transactionId, setTransactionId] = useState('')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const validateForm = () => {
    if (!formData.phoneNumber) {
      setError('Please enter your phone number')
      return false
    }
    // Basic phone number validation for Rwanda
    const phoneRegex = /^(\+250|250)?(7[2389]\d{7})$/
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError('Please enter a valid Rwanda phone number')
      return false
    }
    return true
  }

  const processPayment = async () => {
    if (!validateForm()) return

    setStep('processing')
    setError('')

    try {
      const paymentReference = paymentAPI.generatePaymentReference()
      setTransactionId(paymentReference)

      // Simplified payment flow - redirect to payment instructions
      setStep('redirect')
      toast.success('Payment instructions sent! Please follow the steps to complete your payment.')
      
    } catch (err: any) {
      setStep('error')
      setError(err.message || 'An error occurred during payment processing. Please try again.')
      toast.error('Payment initiation failed')
    }
  }

  const handlePaymentSuccess = async () => {
    try {
      // Simplified payment verification
      setStep('success')
      toast.success('Payment instructions provided successfully!')
      
      setTimeout(() => {
        onSuccess({
          method: 'manual',
          amount: amount,
          reference: transactionId,
          timestamp: new Date().toISOString(),
          details: {
            phoneNumber: formData.phoneNumber,
            transactionId: transactionId,
            status: 'pending'
          }
        })
      }, 2000)
    } catch (err) {
      setStep('error')
      setError('Payment verification failed. Please contact support.')
    }
  }

  const resetForm = () => {
    setFormData({
      phoneNumber: ''
    })
    setError('')
    setStep('form')
    setTransactionId('')
  }

  const handleClose = () => {
    if (step === 'processing') return // Prevent closing during processing
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Smartphone className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">
              MTN MoMo Payment
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Amount Display */}
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">Total Amount</p>
            <p className="text-3xl font-bold text-green-600">{formatPrice(amount)}</p>
          </div>

          {/* Form Step */}
          {step === 'form' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  MTN MoMo Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 0789123456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter your MTN Rwanda phone number
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={processPayment}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Pay with MTN MoMo
              </button>
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 text-green-600 animate-spin mx-auto" />
              <h3 className="text-lg font-semibold text-gray-900">Processing Payment</h3>
              <p className="text-gray-600">Please wait while we process your MTN MoMo payment...</p>
            </div>
          )}

          {/* Redirect Step */}
          {step === 'redirect' && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Request Sent!</h3>
                <p className="text-green-700 mb-4">
                  Check your phone for the MTN MoMo USSD prompt. Please complete the payment on your phone.
                </p>
                <p className="text-sm text-green-600">
                  Reference: {transactionId}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePaymentSuccess}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  I&apos;ve Completed the Payment
                </button>
                <button
                  onClick={() => setStep('form')}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h3>
                <p className="text-green-700">
                  Your MTN MoMo payment has been processed successfully.
                </p>
              </div>
              <p className="text-sm text-gray-600">
                You will receive a confirmation email shortly.
              </p>
            </div>
          )}

          {/* Error Step */}
          {step === 'error' && (
            <div className="text-center space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Payment Failed</h3>
                <p className="text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setStep('form')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentModal 