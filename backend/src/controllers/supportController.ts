import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { emailService } from '../utils/emailService'

const prisma = new PrismaClient()

// Get all support tickets with filtering and pagination
export const getAllSupportTickets = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      priority, 
      search,
      assignedTo 
    } = req.query

    const skip = (Number(page) - 1) * Number(limit)

    // Build where clause
    const where: any = {}
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (priority && priority !== 'all') {
      where.priority = priority
    }
    
    if (assignedTo) {
      where.assignedTo = assignedTo
    }
    
    if (search) {
      where.OR = [
        { subject: { contains: search as string, mode: 'insensitive' } },
        { customerName: { contains: search as string, mode: 'insensitive' } },
        { customerEmail: { contains: search as string, mode: 'insensitive' } },
        { message: { contains: search as string, mode: 'insensitive' } }
      ]
    }

    const [tickets, total] = await Promise.all([
      prisma.support_tickets.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.support_tickets.count({ where })
    ])

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    })
  } catch (error) {
    console.error('Error fetching support tickets:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support tickets'
    })
  }
}

// Get support ticket by ID
export const getSupportTicketById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const ticket = await prisma.support_tickets.findUnique({
      where: { id }
    })

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      })
    }

    res.json({
      success: true,
      data: { ticket }
    })
  } catch (error) {
    console.error('Error fetching support ticket:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support ticket'
    })
  }
}

// Create new support ticket
export const createSupportTicket = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerEmail,
      subject,
      message,
      priority = 'MEDIUM',
      orderId
    } = req.body

    // Validate required fields
    if (!customerName || !customerEmail || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customerName, customerEmail, subject, message'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      })
    }

    // Create the ticket
    const ticket = await prisma.support_tickets.create({
      data: {
        customerName,
        customerEmail,
        subject,
        message,
        priority: priority.toUpperCase(),
        orderId: orderId || null,
        status: 'PENDING'
      }
    })

    // Send email notification to admin (don't block if this fails)
    try {
      await emailService.sendSupportTicketNotification(ticket)
    } catch (emailError) {
      console.error('Support ticket notification email failed:', emailError)
    }

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: { ticket }
    })
  } catch (error) {
    console.error('Error creating support ticket:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create support ticket'
    })
  }
}

// Update support ticket
export const updateSupportTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const {
      status,
      priority,
      assignedTo,
      adminNotes
    } = req.body

    // Check if ticket exists
    const existingTicket = await prisma.support_tickets.findUnique({
      where: { id }
    })

    if (!existingTicket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      })
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    }

    if (status) {
      updateData.status = status.toUpperCase()
      if (status.toUpperCase() === 'RESOLVED' && !existingTicket.resolvedAt) {
        updateData.resolvedAt = new Date()
      }
    }

    if (priority) {
      updateData.priority = priority.toUpperCase()
    }

    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes
    }

    const ticket = await prisma.support_tickets.update({
      where: { id },
      data: updateData
    })

    // Send email notification to customer if status changed (don't block if this fails)
    if (status && status !== existingTicket.status) {
      try {
        await emailService.sendSupportTicketStatusUpdate(
          existingTicket.customerEmail,
          existingTicket.subject,
          status
        )
      } catch (emailError) {
        console.error('Support ticket status update email failed:', emailError)
      }
    }

    res.json({
      success: true,
      message: 'Support ticket updated successfully',
      data: { ticket }
    })
  } catch (error) {
    console.error('Error updating support ticket:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update support ticket'
    })
  }
}

// Delete support ticket
export const deleteSupportTicket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Check if ticket exists
    const ticket = await prisma.support_tickets.findUnique({
      where: { id }
    })

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      })
    }

    await prisma.support_tickets.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Support ticket deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting support ticket:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete support ticket'
    })
  }
}

// Get support ticket statistics
export const getSupportTicketStats = async (req: Request, res: Response) => {
  try {
    const [
      total,
      pending,
      inProgress,
      resolved,
      closed,
      highPriority,
      urgentPriority
    ] = await Promise.all([
      prisma.support_tickets.count(),
      prisma.support_tickets.count({ where: { status: 'PENDING' } }),
      prisma.support_tickets.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.support_tickets.count({ where: { status: 'RESOLVED' } }),
      prisma.support_tickets.count({ where: { status: 'CLOSED' } }),
      prisma.support_tickets.count({ where: { priority: 'HIGH' } }),
      prisma.support_tickets.count({ where: { priority: 'URGENT' } })
    ])

    res.json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        resolved,
        closed,
        highPriority,
        urgentPriority
      }
    })
  } catch (error) {
    console.error('Error fetching support ticket stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support ticket statistics'
    })
  }
}
