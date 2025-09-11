'use client'

import React, { useState } from 'react'
import { Mail, CheckCircle, XCircle, AlertCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'

interface EmailTestProps {
  className?: string
}

const EmailTest: React.FC<EmailTestProps> = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [emailStatus, setEmailStatus] = useState<{
    configured: boolean
    testPassed: boolean
    message: string
  } | null>(null)

  const checkEmailConfiguration = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/orders/notify')
      const data = await response.json()
      
      setEmailStatus({
        configured: data.emailConfigured,
        testPassed: data.emailTestPassed,
        message: data.message
      })

      if (data.emailConfigured && data.emailTestPassed) {
        toast.success('Email service is configured and working!')
      } else if (data.emailConfigured) {
        toast.error('Email service is configured but test failed')
      } else {
        toast.error('Email service is not configured')
      }
    } catch (error) {
      console.error('Error checking email configuration:', error)
      toast.error('Failed to check email configuration')
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestEmail = async () => {
    setIsLoading(true)
    try {
      const testOrderData = {
        orderData: {
          orderNumber: `TEST-${Date.now().toString().slice(-6)}`,
          customerName: 'Test Customer',
          customerEmail: 'test@example.com',
          customerPhone: '0781234567',
          total: 75000,
          items: [
            {
              id: '1',
              name: 'Red Rose Bouquet',
              price: 25000,
              quantity: 2,
              image: '/images/placeholder-product.jpg'
            },
            {
              id: '2',
              name: 'White Lily Arrangement',
              price: 25000,
              quantity: 1,
              image: '/images/placeholder-product.jpg'
            }
          ],
          orderDate: new Date().toISOString(),
          deliveryAddress: 'Kigali, Rwanda',
          paymentMethod: 'MoMo',
          orderStatus: 'Pending'
        }
      }

      const response = await fetch('/api/admin/orders/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testOrderData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Test email sent successfully!')
      } else {
        toast.error(data.message || 'Failed to send test email')
      }
    } catch (error) {
      console.error('Error sending test email:', error)
      toast.error('Failed to send test email')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    if (!emailStatus) return <Mail className="w-5 h-5 text-gray-400" />
    
    if (emailStatus.configured && emailStatus.testPassed) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    } else if (emailStatus.configured) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />
    } else {
      return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getStatusColor = () => {
    if (!emailStatus) return 'text-gray-600'
    
    if (emailStatus.configured && emailStatus.testPassed) {
      return 'text-green-600'
    } else if (emailStatus.configured) {
      return 'text-yellow-600'
    } else {
      return 'text-red-600'
    }
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <Mail className="w-6 h-6 text-pink-600" />
        <h3 className="text-lg font-semibold text-gray-900">Email Notification System</h3>
      </div>

      <div className="space-y-4">
        {/* Status Display */}
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          {getStatusIcon()}
          <div className="flex-1">
            <p className={`font-medium ${getStatusColor()}`}>
              {emailStatus ? emailStatus.message : 'Email status unknown'}
            </p>
            {emailStatus && (
              <p className="text-sm text-gray-500 mt-1">
                Configured: {emailStatus.configured ? 'Yes' : 'No'} | 
                Test Passed: {emailStatus.testPassed ? 'Yes' : 'No'}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={checkEmailConfiguration}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isLoading ? 'Checking...' : 'Check Configuration'}</span>
          </button>

          <button
            onClick={sendTestEmail}
            disabled={isLoading || !emailStatus?.configured}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>{isLoading ? 'Sending...' : 'Send Test Email'}</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Create a <code className="bg-blue-100 px-1 rounded">.env.local</code> file in your project root</li>
            <li>Add your SMTP configuration (see EMAIL_SETUP_GUIDE.md)</li>
            <li>Restart your development server</li>
            <li>Click "Check Configuration" to verify setup</li>
            <li>Click "Send Test Email" to test the system</li>
          </ol>
        </div>

        {/* Features List */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Email Features:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>✅ Beautiful HTML email templates with product images</li>
            <li>✅ Automatic notifications for new orders</li>
            <li>✅ Mobile-responsive design</li>
            <li>✅ Order details and customer information</li>
            <li>✅ Direct links to admin panel</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default EmailTest
