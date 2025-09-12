'use client'

import React, { useState, useEffect } from 'react'
import { 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  Filter, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  X
} from 'lucide-react'

interface SupportTicket {
  id: string
  customerName: string
  customerEmail: string
  subject: string
  message: string
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdAt: string
  updatedAt: string
  assignedTo?: string
  adminNotes?: string
  orderId?: string
  resolvedAt?: string
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(null)
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')

  const fetchTickets = async () => {
    try {
      setIsLoading(true)
      
      // Build query parameters
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.priority !== 'all') params.append('priority', filters.priority)
      
      const response = await fetch(`/api/admin/support-tickets?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch support tickets')
      
      const result = await response.json()
      if (result.success) {
        setTickets(result.data.tickets)
      } else {
        throw new Error('Failed to fetch support tickets')
      }
    } catch (error) {
      console.error('Error fetching support tickets:', error)
      setError('Failed to load support tickets')
      // Fallback to empty array on error
      setTickets([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [searchTerm, filters])

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const ticketData = {
      customerName: formData.get('customerName') as string,
      customerEmail: formData.get('customerEmail') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      priority: formData.get('priority') as string
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      const response = await fetch('/api/admin/support-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(ticketData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.backendAvailable === false) {
          setError('Backend server is not available. Changes are saved locally but may not persist.')
        } else {
        throw new Error(errorData.error || 'Failed to create support ticket')
      }
      } else {
      const result = await response.json()
      if (result.success) {
        // Refresh the tickets list
        await fetchTickets()
        setShowAddForm(false)
        setSuccess('Support ticket created successfully!')
        setError(null)
        // Reset form
        ;(e.target as HTMLFormElement).reset()
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000)
      } else {
        throw new Error(result.message || 'Failed to create support ticket')
        }
      }
    } catch (error) {
      console.error('Error creating support ticket:', error)
      setError(error instanceof Error ? error.message : 'Failed to create support ticket')
    }
  }

  const handleEditTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!editingTicket) return

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const updateData = {
      status: formData.get('status') as string,
      priority: formData.get('priority') as string,
      assignedTo: formData.get('assignedTo') as string || null,
      adminNotes: formData.get('adminNotes') as string || null
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      const response = await fetch(`/api/admin/support-tickets/${editingTicket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.backendAvailable === false) {
          setError('Backend server is not available. Changes are saved locally but may not persist.')
        } else {
        throw new Error(errorData.error || 'Failed to update support ticket')
      }
      } else {
      const result = await response.json()
      if (result.success) {
        // Refresh the tickets list
        await fetchTickets()
        setEditingTicket(null)
        setSuccess('Support ticket updated successfully!')
        setError(null)
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000)
      } else {
        throw new Error(result.message || 'Failed to update support ticket')
        }
      }
    } catch (error) {
      console.error('Error updating support ticket:', error)
      setError(error instanceof Error ? error.message : 'Failed to update support ticket')
    }
  }

  const handleDeleteTicket = async (ticketId: string) => {
    if (confirm('Are you sure you want to delete this ticket?')) {
      setError(null)
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
        const response = await fetch(`/api/admin/support-tickets/${ticketId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to delete support ticket')
        }

        const result = await response.json()
        if (result.success) {
          // Refresh the tickets list
          await fetchTickets()
          setSuccess('Support ticket deleted successfully!')
          setError(null)
          // Clear success message after 3 seconds
          setTimeout(() => setSuccess(null), 3000)
        } else {
          throw new Error(result.message || 'Failed to delete support ticket')
        }
      } catch (error) {
        console.error('Error deleting support ticket:', error)
        setError(error instanceof Error ? error.message : 'Failed to delete support ticket')
      }
    }
  }

  const updateTicketStatus = async (ticketId: string, newStatus: SupportTicket['status']) => {
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/support-tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update ticket status')
      }

      const result = await response.json()
      if (result.success) {
        // Refresh the tickets list
        await fetchTickets()
      } else {
        throw new Error(result.message || 'Failed to update ticket status')
      }
    } catch (error) {
      console.error('Error updating ticket status:', error)
      setError(error instanceof Error ? error.message : 'Failed to update ticket status')
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filters.status === 'all' || ticket.status === filters.status
    const matchesPriority = filters.priority === 'all' || ticket.priority === filters.priority
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesPriority && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600">Loading support tickets...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <div className="flex items-center space-x-3 text-red-600">
          <MessageCircle className="w-6 h-6" />
          <h2 className="text-lg font-semibold">Error</h2>
        </div>
        <p className="mt-2 text-gray-600">{error}</p>
        <button onClick={fetchTickets} className="btn btn-primary mt-4">
          Try Again
        </button>
      </div>
    )
  }

  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === 'PENDING').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED').length
  }

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center space-x-3 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <p className="font-medium">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3 text-red-800">
            <MessageCircle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Customer Support</h1>
            <p className="text-blue-100 text-lg">Manage customer support tickets and inquiries</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-blue-100">Total Tickets</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tickets by subject, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
            >
              <option value="all">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Ticket Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Ticket
        </button>
      </div>

      {/* Add Ticket Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Ticket</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleAddTicket} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
                <input
                  type="email"
                  name="customerEmail"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select name="priority" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="LOW">Low</option>
                <option value="MEDIUM" selected>Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                Add Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Ticket Form */}
      {editingTicket && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Edit Support Ticket</h2>
            <button
              onClick={() => setEditingTicket(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleEditTicket} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  defaultValue={editingTicket.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  name="priority"
                  defaultValue={editingTicket.priority}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
              <input
                type="text"
                name="assignedTo"
                defaultValue={editingTicket.assignedTo || ''}
                placeholder="Enter admin name or email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
              <textarea
                name="adminNotes"
                rows={4}
                defaultValue={editingTicket.adminNotes || ''}
                placeholder="Add internal notes about this ticket..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingTicket(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                Update Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600">No tickets match your current filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{ticket.subject}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.priority === 'LOW' ? 'bg-gray-100 text-gray-800' :
                          ticket.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                          ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600"><span className="font-medium">Customer:</span> {ticket.customerName}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {ticket.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600"><span className="font-medium">Created:</span> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Updated:</span> {new Date(ticket.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {ticket.assignedTo && (
                      <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Assigned to:</span> {ticket.assignedTo}</p>
                    )}
                    
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">{ticket.message}</p>
                    </div>
                    
                    {ticket.adminNotes && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-4">
                        <p className="text-sm font-medium text-blue-900 mb-1">Admin Notes:</p>
                        <p className="text-sm text-blue-800">{ticket.adminNotes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-3 lg:min-w-[200px]">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quick Status Update</label>
                      <select
                        value={ticket.status}
                        onChange={(e) => updateTicketStatus(ticket.id, e.target.value as SupportTicket['status'])}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTicket(ticket)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTicket(ticket.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
