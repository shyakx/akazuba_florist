/**
 * Accessibility utilities for the Akazuba Florist application
 * 
 * This module provides utilities to enhance accessibility:
 * - ARIA label generation
 * - Focus management
 * - Screen reader support
 * - Keyboard navigation helpers
 * - Color contrast validation
 * 
 * @fileoverview Accessibility utilities and helpers
 * @author Akazuba Development Team
 * @version 1.0.0
 */

/**
 * Generate descriptive ARIA labels for common UI elements
 */
export const ariaLabels = {
  /**
   * Generate ARIA label for product cards
   */
  productCard: (name: string, price: number, inStock: boolean) => 
    `${name}, ${price} RWF, ${inStock ? 'in stock' : 'out of stock'}`,

  /**
   * Generate ARIA label for category cards
   */
  categoryCard: (name: string, productCount: number) => 
    `${name} category, ${productCount} products available`,

  /**
   * Generate ARIA label for order items
   */
  orderItem: (productName: string, quantity: number, price: number) => 
    `${productName}, quantity ${quantity}, ${price} RWF each`,

  /**
   * Generate ARIA label for navigation items
   */
  navItem: (label: string, isActive: boolean) => 
    `${label}${isActive ? ', current page' : ''}`,

  /**
   * Generate ARIA label for form fields
   */
  formField: (label: string, required: boolean, error?: string) => 
    `${label}${required ? ', required' : ''}${error ? `, error: ${error}` : ''}`,

  /**
   * Generate ARIA label for buttons
   */
  button: (action: string, target?: string) => 
    `${action}${target ? ` ${target}` : ''}`,

  /**
   * Generate ARIA label for loading states
   */
  loading: (item: string) => `Loading ${item}, please wait`,

  /**
   * Generate ARIA label for error states
   */
  error: (context: string, message: string) => 
    `Error in ${context}: ${message}`,

  /**
   * Generate ARIA label for success states
   */
  success: (action: string) => `${action} completed successfully`
}

/**
 * Focus management utilities
 */
export const focusManagement = {
  /**
   * Trap focus within a container (for modals, dropdowns)
   */
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    container.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleTabKey)
    }
  },

  /**
   * Restore focus to a previously focused element
   */
  restoreFocus: (element: HTMLElement | null) => {
    if (element && typeof element.focus === 'function') {
      element.focus()
    }
  },

  /**
   * Move focus to next/previous element in a list
   */
  moveFocus: (direction: 'next' | 'previous', currentElement: HTMLElement) => {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[]

    const currentIndex = focusableElements.indexOf(currentElement)
    let nextIndex: number

    if (direction === 'next') {
      nextIndex = currentIndex + 1
      if (nextIndex >= focusableElements.length) {
        nextIndex = 0 // Wrap to first element
      }
    } else {
      nextIndex = currentIndex - 1
      if (nextIndex < 0) {
        nextIndex = focusableElements.length - 1 // Wrap to last element
      }
    }

    focusableElements[nextIndex]?.focus()
  }
}

/**
 * Screen reader utilities
 */
export const screenReader = {
  /**
   * Announce a message to screen readers
   */
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  },

  /**
   * Create a visually hidden element for screen readers
   */
  createScreenReaderOnly: (content: string) => {
    const element = document.createElement('span')
    element.className = 'sr-only'
    element.textContent = content
    return element
  }
}

/**
 * Keyboard navigation utilities
 */
export const keyboardNavigation = {
  /**
   * Handle arrow key navigation in lists
   */
  handleArrowKeys: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    orientation: 'horizontal' | 'vertical' = 'vertical'
  ) => {
    const isVertical = orientation === 'vertical'
    const isHorizontal = orientation === 'horizontal'

    let newIndex = currentIndex

    switch (event.key) {
      case isVertical ? 'ArrowDown' : 'ArrowRight':
        newIndex = Math.min(currentIndex + 1, items.length - 1)
        break
      case isVertical ? 'ArrowUp' : 'ArrowLeft':
        newIndex = Math.max(currentIndex - 1, 0)
        break
      case 'Home':
        newIndex = 0
        break
      case 'End':
        newIndex = items.length - 1
        break
      default:
        return currentIndex
    }

    if (newIndex !== currentIndex) {
      event.preventDefault()
      items[newIndex]?.focus()
    }

    return newIndex
  },

  /**
   * Handle Enter and Space key activation
   */
  handleActivation: (event: KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      callback()
    }
  }
}

/**
 * Color contrast utilities
 */
export const colorContrast = {
  /**
   * Calculate relative luminance of a color
   */
  getLuminance: (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  },

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio: (color1: [number, number, number], color2: [number, number, number]) => {
    const lum1 = colorContrast.getLuminance(...color1)
    const lum2 = colorContrast.getLuminance(...color2)
    const brightest = Math.max(lum1, lum2)
    const darkest = Math.min(lum1, lum2)
    return (brightest + 0.05) / (darkest + 0.05)
  },

  /**
   * Check if contrast ratio meets WCAG standards
   */
  meetsWCAG: (color1: [number, number, number], color2: [number, number, number], level: 'AA' | 'AAA' = 'AA') => {
    const ratio = colorContrast.getContrastRatio(color1, color2)
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7
  }
}

/**
 * Form accessibility utilities
 */
export const formAccessibility = {
  /**
   * Generate unique IDs for form elements
   */
  generateId: (prefix: string) => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,

  /**
   * Create accessible form field props
   */
  createFieldProps: (name: string, label: string, error?: string, required = false) => {
    const id = formAccessibility.generateId(name)
    const errorId = error ? `${id}-error` : undefined

    return {
      id,
      name,
      'aria-label': ariaLabels.formField(label, required, error),
      'aria-required': required,
      'aria-invalid': !!error,
      'aria-describedby': errorId,
      required
    }
  },

  /**
   * Create accessible error message props
   */
  createErrorProps: (fieldId: string, error: string) => ({
    id: `${fieldId}-error`,
    role: 'alert',
    'aria-live': 'polite' as const
  })
}

/**
 * Common accessibility patterns
 */
export const patterns = {
  /**
   * Skip link for keyboard navigation
   */
  skipLink: (target: string, label = 'Skip to main content') => ({
    href: target,
    className: 'skip-link',
    children: label
  }),

  /**
   * Loading spinner with proper labeling
   */
  loadingSpinner: (label = 'Loading') => ({
    role: 'status',
    'aria-label': label,
    'aria-live': 'polite' as const
  }),

  /**
   * Progress indicator
   */
  progressIndicator: (current: number, total: number, label?: string) => ({
    role: 'progressbar',
    'aria-valuenow': current,
    'aria-valuemin': 0,
    'aria-valuemax': total,
    'aria-label': label || `Progress: ${current} of ${total}`
  })
}

export default {
  ariaLabels,
  focusManagement,
  screenReader,
  keyboardNavigation,
  colorContrast,
  formAccessibility,
  patterns
}
