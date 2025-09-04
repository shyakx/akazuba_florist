'use client'

import React, { useState, useEffect } from 'react'
import { 
  Settings, 
  Save, 
  User, 
  Bell, 
  Shield, 
  Database,
  Mail,
  Globe,
  CreditCard
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    // General Settings
    businessName: 'Akazuba Florist',
    businessEmail: 'admin@akazubaflorist.com',
    businessPhone: '+250 788 123 456',
    businessAddress: 'Kigali, Rwanda',
    currency: 'RWF',
    timezone: 'Africa/Kigali',
    
    // Notification Settings
    emailNotifications: 'true',
    orderNotifications: 'true',
    customerNotifications: 'true',
    marketingEmails: 'false',
    
    // Security Settings
    twoFactorAuth: 'false',
    sessionTimeout: '30',
    passwordExpiry: '90',
    
    // System Settings
    autoBackup: 'true',
    backupFrequency: 'daily',
    logRetention: '30',
    maintenanceMode: 'false'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch('/api/admin/settings/public')
      if (!response.ok) throw new Error('Failed to fetch settings')
      
      const result = await response.json()
      if (result.success) {
        setSettings(result.data)
      } else {
        throw new Error('Failed to fetch settings')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      // Keep default settings on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
    setIsSaving(true)
      
      const response = await fetch('/api/admin/settings/public', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      })
      
      if (!response.ok) throw new Error('Failed to save settings')
      
      const result = await response.json()
      if (result.success) {
        alert('Settings saved successfully!')
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
    setIsSaving(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'system', name: 'System', icon: Database }
  ]

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) => setSettings({...settings, businessName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
            <input
              type="email"
              value={settings.businessEmail}
              onChange={(e) => setSettings({...settings, businessEmail: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone</label>
            <input
              type="tel"
              value={settings.businessPhone}
              onChange={(e) => setSettings({...settings, businessPhone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
            <input
              type="text"
              value={settings.businessAddress}
              onChange={(e) => setSettings({...settings, businessAddress: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({...settings, currency: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="RWF">RWF - Rwandan Franc</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
            </select>
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Africa/Kigali">Africa/Kigali</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
        <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Enable email notifications', description: 'Receive notifications via email' },
            { key: 'orderNotifications', label: 'Order notifications', description: 'Get notified when new orders are placed' },
            { key: 'customerNotifications', label: 'Customer notifications', description: 'Get notified when customers register' },
            { key: 'marketingEmails', label: 'Marketing emails', description: 'Receive marketing and promotional emails' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
          <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key as keyof typeof settings] === 'true'}
                  onChange={(e) => setSettings({...settings, [item.key]: e.target.checked ? 'true' : 'false'})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                type="checkbox"
                checked={settings.twoFactorAuth === 'true'}
                onChange={(e) => setSettings({...settings, twoFactorAuth: e.target.checked ? 'true' : 'false'})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
                <input
              type="number"
              value={settings.passwordExpiry}
              onChange={(e) => setSettings({...settings, passwordExpiry: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
            </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Automatic Backup</p>
              <p className="text-sm text-gray-600">Automatically backup your data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                type="checkbox"
                checked={settings.autoBackup === 'true'}
                onChange={(e) => setSettings({...settings, autoBackup: e.target.checked ? 'true' : 'false'})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                <select
              value={settings.backupFrequency}
              onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
                </select>
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Log Retention (days)</label>
                      <input
              type="number"
              value={settings.logRetention}
              onChange={(e) => setSettings({...settings, logRetention: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
                </div>
          
          <div className="flex items-center justify-between">
                <div>
              <p className="font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-600">Put the system in maintenance mode</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode === 'true'}
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked ? 'true' : 'false'})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-end">
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
          </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'system' && renderSystemSettings()}
          </div>
        </div>
      </div>
    </div>
  )
}