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
  Eye
} from 'lucide-react'

interface SupportTicket {
  id: string
  customerName: string
  customerEmail: string
  subject: string
  message: string
  status: 'pending' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  assignedTo?: string
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
      
      const response = await fetch(`/api/admin/support-tickets/public?${params.toString()}`)
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

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementation for adding ticket
    setShowAddForm(false)
  }

  const handleEditTicket = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementation for editing ticket
    setEditingTicket(null)
  }

  const handleDeleteTicket = (ticketId: string) => {
    if (confirm('Are you sure you want to delete this ticket?')) {
      setTickets(prev => prev.filter(ticket => ticket.id !== ticketId))
    }
  }

  const updateTicketStatus = (ticketId: string, newStatus: SupportTicket['status']) => {
      setTickets(prev => prev.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() } : ticket
      ))
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
      <div>
        <div>
          <div></div>
          <p>Loading support tickets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === 'pending').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  }

  return (
    <div>
      {/* Header */}
      <div>
        <h1>Customer Support</h1>
        <div>
          <span>Total Tickets: {stats.total}</span>
        </div>
      </div>

      {/* Stats */}
      <div>
        <div>
          <div>
            <div>
              <MessageCircle />
            </div>
            <div>
              <p>Total</p>
              <p>{stats.total}</p>
            </div>
          </div>
        </div>

        <div>
          <div>
            <div>
              <Clock />
            </div>
            <div>
              <p>Pending</p>
              <p>{stats.pending}</p>
            </div>
          </div>
        </div>

        <div>
          <div>
            <div>
              <MessageCircle />
            </div>
            <div>
              <p>In Progress</p>
              <p>{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div>
          <div>
            <div>
              <CheckCircle />
            </div>
            <div>
              <p>Resolved</p>
              <p>{stats.resolved}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div>
        <div>
          <div>
            <div>
              <Filter />
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <Search />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Add Ticket Button */}
                    <div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus />
          Add Ticket
        </button>
                    </div>

      {/* Add Ticket Form */}
      {showAddForm && (
        <div>
          <div>
            <h2>Add New Ticket</h2>
                      <button
              onClick={() => setShowAddForm(false)}
            >
              ×
            </button>
          </div>
          <form onSubmit={handleAddTicket}>
            <div>
              <label>Customer Name:</label>
              <input
                type="text"
                required
              />
            </div>
            <div>
              <label>Customer Email:</label>
              <input
                type="email"
                required
              />
            </div>
            <div>
              <label>Subject:</label>
              <input
                type="text"
                required
              />
            </div>
            <div>
              <label>Message:</label>
              <textarea
                required
                rows={4}
              />
            </div>
            <div>
              <label>Priority:</label>
              <select>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <button type="submit">
                Add Ticket
                      </button>
                      <button
                type="button"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Ticket Form */}
      {editingTicket && (
        <div>
          <div>
            <h2>Edit Ticket</h2>
            <button
              onClick={() => setEditingTicket(null)}
            >
              ×
                      </button>
          </div>
          <form onSubmit={handleEditTicket}>
            <div>
              <label>Status:</label>
                      <select
                value={editingTicket.status}
                onChange={(e) => setEditingTicket(prev => prev ? { ...prev, status: e.target.value as SupportTicket['status'] } : null)}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
            <div>
              <label>Priority:</label>
              <select
                value={editingTicket.priority}
                onChange={(e) => setEditingTicket(prev => prev ? { ...prev, priority: e.target.value as SupportTicket['priority'] } : null)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
        </div>
            <div>
              <label>Assigned To:</label>
              <input
                type="text"
                value={editingTicket.assignedTo || ''}
                onChange={(e) => setEditingTicket(prev => prev ? { ...prev, assignedTo: e.target.value } : null)}
              />
      </div>
            <div>
              <button type="submit">
                Update Ticket
              </button>
              <button
                type="button"
                onClick={() => setEditingTicket(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      <div>
        {filteredTickets.length === 0 ? (
              <div>
            <MessageCircle />
            <h3>No tickets found</h3>
            <p>No tickets match your current filters</p>
              </div>
        ) : (
          <div>
            {filteredTickets.map((ticket) => (
              <div key={ticket.id}>
                <div>
              <div>
                    <h3>{ticket.subject}</h3>
              <div>
                      <span>{ticket.status}</span>
                      <span>{ticket.priority}</span>
                </div>
              </div>
                  <div>
                    <div>
                      <span>Customer: {ticket.customerName}</span>
                      <span>Email: {ticket.customerEmail}</span>
                    </div>
                <div>
                      <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      <span>Updated: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                  </div>
                    {ticket.assignedTo && (
                      <div>
                        <span>Assigned to: {ticket.assignedTo}</span>
                </div>
              )}
            </div>
                  <div>
                    <p>{ticket.message}</p>
                  </div>
                  <div>
                    <div>
                      <select
                        value={ticket.status}
                        onChange={(e) => updateTicketStatus(ticket.id, e.target.value as SupportTicket['status'])}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <button>
                        <Eye />
                        View
              </button>
              <button
                        onClick={() => setEditingTicket(ticket)}
                      >
                        <Edit />
                        Edit
              </button>
              <button
                        onClick={() => handleDeleteTicket(ticket.id)}
              >
                        <Trash2 />
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
