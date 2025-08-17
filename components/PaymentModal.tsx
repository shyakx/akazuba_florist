'use client'

import React, { useState } from 'react'
import { X, Smartphone, CreditCard, CheckCircle, Loader2, AlertCircle, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { paymentAPI } from '@/lib/payment-api'
import { momoAPI } from '@/lib/momo-api'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (paymentDetails: any) => void
  amount: number
  paymentMethod: 'momo' | 'bk'
  customerEmail: string
  customerName: string
}

const PaymentModal = ({ isOpen, onClose, onSuccess, amount, paymentMethod, customerEmail, customerName }: PaymentModalProps) => {
  const [step, setStep] = useState<'form' | 'processing' | 'redirect' | 'success' | 'error'>('form')
  const [formData, setFormData] = useState({
    phoneNumber: '',
    accountNumber: '',
    accountName: '',
    reference: ''
  })
  const [error, setError] = useState('')
  const [paymentLink, setPaymentLink] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [momoReferenceId, setMomoReferenceId] = useState('')

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
    if (paymentMethod === 'momo') {
      if (!formData.phoneNumber) {
        setError('Please enter your phone number')
        return false
      }
      if (!momoAPI.validatePhoneNumber(formData.phoneNumber)) {
        setError('Please enter a valid MTN Rwanda phone number')
        return false
      }
    } else {
      if (!formData.accountNumber) {
        setError('Please enter your account number')
        return false
      }
      if (!formData.accountName) {
        setError('Please enter your account name')
        return false
      }
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

      if (paymentMethod === 'momo') {
        // MTN MoMo Payment (v2.0)
        const momoResponse = await momoAPI.requestToPay({
          amount: amount,
          phoneNumber: formData.phoneNumber,
          reference: paymentReference,
          description: `Akazuba Florist Order - ${customerName}`
        })

        if (momoResponse.status === 'SUCCESSFUL') {
          setMomoReferenceId(momoResponse.data.financialTransactionId)
          setStep('redirect')
          toast.success('MoMo payment request sent! Check your phone for USSD prompt.')
        } else {
          throw new Error(momoResponse.message || 'Failed to initiate MoMo payment')
        }
      } else {
        // Bank Transfer via Backend (Flutterwave)
        const response = await paymentAPI.initiateBankTransfer({
          amount: amount,
          accountNumber: formData.accountNumber,
          accountName: formData.accountName,
          email: customerEmail,
          reference: paymentReference
        })

        if (response.status === 'success') {
          setPaymentLink(response.data.link)
          setStep('redirect')
          toast.success('Bank transfer initiated! Redirecting to payment page...')
        } else {
          throw new Error(response.message || 'Failed to initiate bank transfer')
        }
      }
    } catch (err: any) {
      setStep('error')
      setError(err.message || 'An error occurred during payment processing. Please try again.')
      toast.error('Payment initiation failed')
    }
  }

  const handlePaymentSuccess = async () => {
    try {
      if (paymentMethod === 'momo') {
        // Check MoMo payment status
        const status = await momoAPI.checkPaymentStatus(momoReferenceId)
        
        if (status.status === 'SUCCESSFUL') {
          setStep('success')
          toast.success('MoMo payment verified successfully!')
          
          setTimeout(() => {
            onSuccess({
              method: paymentMethod,
              amount: amount,
              reference: transactionId,
              timestamp: new Date().toISOString(),
              momoRef: momoReferenceId,
              details: {
                phoneNumber: formData.phoneNumber,
                transactionId: momoReferenceId,
                status: status.status
              }
            })
          }, 2000)
        } else {
          throw new Error('Payment not yet completed. Please wait and try again.')
        }
      } else {
        // Bank transfer verification (existing logic)
        const verification = await paymentAPI.verifyPayment(transactionId)
        
        if (verification.status === 'success' && verification.data.status === 'successful') {
          setStep('success')
          toast.success('Payment verified successfully!')
          
          setTimeout(() => {
            onSuccess({
              method: paymentMethod,
              amount: amount,
              reference: transactionId,
              timestamp: new Date().toISOString(),
              flwRef: verification.data.flw_ref,
              details: {
                accountNumber: formData.accountNumber,
                accountName: formData.accountName,
                transferReference: transactionId
              }
            })
          }, 2000)
        } else {
          throw new Error('Payment verification failed')
        }
      }
    } catch (err) {
      setStep('error')
      setError('Payment verification failed. Please contact support.')
    }
  }

  const resetForm = () => {
    setFormData({
      phoneNumber: '',
      accountNumber: '',
      accountName: '',
      reference: ''
    })
    setError('')
    setStep('form')
    setPaymentLink('')
    setTransactionId('')
    setMomoReferenceId('')
  }

  const handleClose = () => {
    if (step === 'processing') return // Prevent closing during processing
    resetForm()
    onClose()
  }

  const openPaymentLink = () => {
    if (paymentLink) {
      window.open(paymentLink, '_blank')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {paymentMethod === 'momo' ? (
              <Smartphone className="h-6 w-6 text-green-600" />
            ) : (
              <CreditCard className="h-6 w-6 text-blue-600" />
            )}
            <h2 className="text-xl font-bold text-gray-900">
              {paymentMethod === 'momo' ? 'MTN MoMo Payment' : 'Bank Transfer'}
            </h2>
          </div>
          {step !== 'processing' && (
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'form' && (
            <div className="space-y-6">
              {/* Payment Amount */}
              <div className="text-center">
                <p className="text-gray-600 mb-2">Payment Amount</p>
                <p className="text-3xl font-bold text-pink-600">{formatPrice(amount)}</p>
              </div>

              {/* Payment Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  {paymentMethod === 'momo' ? 'MTN MoMo Payment' : 'Bank Transfer'}
                </h3>
                {paymentMethod === 'momo' ? (
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>• Enter your MTN MoMo phone number</p>
                    <p>• You&apos;ll receive a USSD prompt on your phone</p>
                    <p>• Enter your MoMo PIN to confirm payment</p>
                    <p>• Payment will be processed instantly</p>
                    <p>• You&apos;ll receive SMS confirmation</p>
                    <p className="font-semibold">💰 Direct MTN MoMo integration</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>• Enter your bank account details</p>
                    <p>• You&apos;ll be redirected to secure payment page</p>
                    <p>• Complete the bank transfer</p>
                    <p>• Payment will be confirmed within 24 hours</p>
                    <p className="font-semibold">💰 Real money will be transferred to: 100161182448</p>
                  </div>
                )}
              </div>

              {/* Payment Form */}
              {paymentMethod === 'momo' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MTN MoMo Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., +250 784 586 110"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your MTN Rwanda MoMo number
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="Enter your account number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name *
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      placeholder="Enter your account name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={processPayment}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {paymentMethod === 'momo' ? 'Pay with MTN MoMo' : 'Proceed to Bank Transfer'}
                </button>
                <button
                  onClick={handleClose}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Initializing Payment</h3>
              <p className="text-gray-600">
                {paymentMethod === 'momo' 
                  ? 'Sending payment request to MTN MoMo...' 
                  : 'Connecting to secure payment gateway...'
                }
              </p>
            </div>
          )}

          {step === 'redirect' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {paymentMethod === 'momo' ? 'MoMo Payment Requested' : 'Redirecting to Payment'}
              </h3>
              <p className="text-gray-600 mb-4">
                {paymentMethod === 'momo' 
                  ? 'Please check your phone for the MTN MoMo USSD prompt and complete the payment.'
                  : 'You will be redirected to the secure payment page to complete your transaction.'
                }
              </p>
              <div className="space-y-3">
                {paymentMethod === 'bk' && (
                  <button
                    onClick={openPaymentLink}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                  >
                    Open Payment Page
                  </button>
                )}
                <button
                  onClick={handlePaymentSuccess}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  I&apos;ve Completed Payment
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">
                Your payment has been processed successfully. Redirecting to order confirmation...
              </p>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Failed</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => setStep('form')}
                className="bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300"
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