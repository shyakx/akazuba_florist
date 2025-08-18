'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { paymentAPI } from '@/lib/payment-api'
import toast from 'react-hot-toast'
import Link from 'next/link'

const PaymentCallbackContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        const transactionId = searchParams.get('tx_ref')
        const status = searchParams.get('status')
        
        if (!transactionId) {
          setError('No transaction reference found')
          setStatus('error')
          return
        }

        if (status === 'cancelled') {
          setError('Payment was cancelled by user')
          setStatus('error')
          return
        }

        // Verify payment with Flutterwave
        const verification = await paymentAPI.verifyPayment(transactionId)
        
        if (verification.status === 'success' && verification.data.status === 'successful') {
          setPaymentDetails(verification.data)
          setStatus('success')
          toast.success('Payment verified successfully!')
        } else {
          setError('Payment verification failed')
          setStatus('error')
        }
      } catch (err: any) {
        setError(err.message || 'Payment verification failed')
        setStatus('error')
      }
    }

    handlePaymentCallback()
  }, [searchParams])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {status === 'success' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully. Thank you for your order!
            </p>
            
            {paymentDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{formatPrice(paymentDetails.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-medium">{paymentDetails.tx_ref}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flutterwave Ref:</span>
                    <span className="font-medium">{paymentDetails.flw_ref}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(paymentDetails.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <Link 
                href="/"
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 block text-center"
              >
                Continue Shopping
              </Link>
              <Link 
                href="/orders"
                className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 block text-center"
              >
                View My Orders
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              {error || 'There was an issue processing your payment. Please try again.'}
            </p>
            
            <div className="space-y-3">
              <Link 
                href="/checkout"
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 block text-center"
              >
                Try Again
              </Link>
              <Link 
                href="/"
                className="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 block text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const PaymentCallbackPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  )
}

export default PaymentCallbackPage 