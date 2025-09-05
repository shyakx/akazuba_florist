'use client'

import React, { forwardRef, useCallback } from 'react'
import { ariaLabels, keyboardNavigation } from '@/lib/accessibility'

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Props for the AccessibleButton component
 */
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant style */
  variant?: ButtonVariant
  /** Button size */
  size?: ButtonSize
  /** Whether the button is in a loading state */
  loading?: boolean
  /** Icon to display before the text */
  icon?: React.ReactNode
  /** Icon to display after the text */
  iconAfter?: React.ReactNode
  /** Whether the button should take full width */
  fullWidth?: boolean
  /** Custom ARIA label (overrides auto-generated) */
  ariaLabel?: string
  /** Whether to show loading spinner */
  showSpinner?: boolean
  /** Loading text to display */
  loadingText?: string
}

/**
 * AccessibleButton Component
 * 
 * A fully accessible button component with:
 * - Proper ARIA attributes
 * - Keyboard navigation support
 * - Loading states
 * - Multiple variants and sizes
 * - Screen reader support
 * - Focus management
 * 
 * @param props - Component props
 * @returns JSX element
 * 
 * @example
 * ```tsx
 * <AccessibleButton
 *   variant="primary"
 *   size="lg"
 *   loading={isSubmitting}
 *   onClick={handleSubmit}
 *   ariaLabel="Submit order"
 * >
 *   Place Order
 * </AccessibleButton>
 * ```
 */
export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconAfter,
    fullWidth = false,
    ariaLabel,
    showSpinner = true,
    loadingText,
    children,
    className = '',
    disabled,
    onClick,
    ...props
  }, ref) => {
    // Generate appropriate ARIA label
    const getAriaLabel = useCallback(() => {
      if (ariaLabel) return ariaLabel
      
      if (loading) {
        return loadingText || ariaLabels.loading(children?.toString() || 'action')
      }
      
      if (typeof children === 'string') {
        return ariaLabels.button(children)
      }
      
      return 'Button'
    }, [ariaLabel, loading, loadingText, children])

    // Handle keyboard activation
    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
      keyboardNavigation.handleActivation(event, () => {
        if (!disabled && !loading && onClick) {
          onClick(event as any)
        }
      })
    }, [disabled, loading, onClick])

    // Base classes
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-lg',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'relative overflow-hidden'
    ]

    // Variant classes
    const variantClasses = {
      primary: [
        'bg-blue-600 text-white',
        'hover:bg-blue-700 focus:ring-blue-500',
        'active:bg-blue-800'
      ],
      secondary: [
        'bg-gray-600 text-white',
        'hover:bg-gray-700 focus:ring-gray-500',
        'active:bg-gray-800'
      ],
      outline: [
        'border-2 border-blue-600 text-blue-600 bg-transparent',
        'hover:bg-blue-50 focus:ring-blue-500',
        'active:bg-blue-100'
      ],
      ghost: [
        'text-gray-700 bg-transparent',
        'hover:bg-gray-100 focus:ring-gray-500',
        'active:bg-gray-200'
      ],
      danger: [
        'bg-red-600 text-white',
        'hover:bg-red-700 focus:ring-red-500',
        'active:bg-red-800'
      ]
    }

    // Size classes
    const sizeClasses = {
      sm: ['px-3 py-1.5 text-sm', 'gap-1.5'],
      md: ['px-4 py-2 text-sm', 'gap-2'],
      lg: ['px-6 py-3 text-base', 'gap-2.5'],
      xl: ['px-8 py-4 text-lg', 'gap-3']
    }

    // Combine all classes
    const buttonClasses = [
      ...baseClasses,
      ...variantClasses[variant],
      ...sizeClasses[size],
      fullWidth ? 'w-full' : '',
      className
    ].filter(Boolean).join(' ')

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )

    return (
      <button
        ref={ref}
        type="button"
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        aria-label={getAriaLabel()}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            {showSpinner && <LoadingSpinner />}
          </div>
        )}

        {/* Button content */}
        <div className={`flex items-center ${loading ? 'opacity-0' : 'opacity-100'}`}>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
          {iconAfter && <span className="flex-shrink-0">{iconAfter}</span>}
        </div>

        {/* Screen reader only loading text */}
        {loading && loadingText && (
          <span className="sr-only">{loadingText}</span>
        )}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'

/**
 * Specialized button components for common use cases
 */

/**
 * Primary action button
 */
export const PrimaryButton = forwardRef<HTMLButtonElement, Omit<AccessibleButtonProps, 'variant'>>(
  (props, ref) => <AccessibleButton ref={ref} variant="primary" {...props} />
)
PrimaryButton.displayName = 'PrimaryButton'

/**
 * Secondary action button
 */
export const SecondaryButton = forwardRef<HTMLButtonElement, Omit<AccessibleButtonProps, 'variant'>>(
  (props, ref) => <AccessibleButton ref={ref} variant="secondary" {...props} />
)
SecondaryButton.displayName = 'SecondaryButton'

/**
 * Outline button
 */
export const OutlineButton = forwardRef<HTMLButtonElement, Omit<AccessibleButtonProps, 'variant'>>(
  (props, ref) => <AccessibleButton ref={ref} variant="outline" {...props} />
)
OutlineButton.displayName = 'OutlineButton'

/**
 * Ghost button
 */
export const GhostButton = forwardRef<HTMLButtonElement, Omit<AccessibleButtonProps, 'variant'>>(
  (props, ref) => <AccessibleButton ref={ref} variant="ghost" {...props} />
)
GhostButton.displayName = 'GhostButton'

/**
 * Danger button for destructive actions
 */
export const DangerButton = forwardRef<HTMLButtonElement, Omit<AccessibleButtonProps, 'variant'>>(
  (props, ref) => <AccessibleButton ref={ref} variant="danger" {...props} />
)
DangerButton.displayName = 'DangerButton'

export default AccessibleButton
