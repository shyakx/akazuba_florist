/**
 * Analytics utilities for the Akazuba Florist application
 * 
 * This module provides:
 * - Google Analytics integration
 * - Custom event tracking
 * - User behavior analytics
 * - Performance metrics
 * - E-commerce tracking
 * 
 * @fileoverview Analytics and tracking utilities
 * @author Akazuba Development Team
 * @version 1.0.0
 */

/**
 * Analytics configuration
 */
export const analyticsConfig = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID,
  facebookPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID,
  hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID,
  enabled: process.env.NODE_ENV === 'production'
}

/**
 * Event categories for analytics
 */
export const eventCategories = {
  USER: 'User',
  PRODUCT: 'Product',
  CART: 'Cart',
  ORDER: 'Order',
  NAVIGATION: 'Navigation',
  SEARCH: 'Search',
  ERROR: 'Error',
  PERFORMANCE: 'Performance'
} as const

/**
 * Event actions for analytics
 */
export const eventActions = {
  // User actions
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  REGISTER: 'Register',
  PROFILE_UPDATE: 'Profile Update',
  
  // Product actions
  VIEW: 'View',
  ADD_TO_CART: 'Add to Cart',
  REMOVE_FROM_CART: 'Remove from Cart',
  ADD_TO_WISHLIST: 'Add to Wishlist',
  REMOVE_FROM_WISHLIST: 'Remove from Wishlist',
  
  // Cart actions
  CART_VIEW: 'Cart View',
  CART_UPDATE: 'Cart Update',
  CART_CLEAR: 'Cart Clear',
  
  // Order actions
  ORDER_START: 'Order Start',
  ORDER_COMPLETE: 'Order Complete',
  ORDER_CANCEL: 'Order Cancel',
  
  // Navigation actions
  PAGE_VIEW: 'Page View',
  LINK_CLICK: 'Link Click',
  BUTTON_CLICK: 'Button Click',
  
  // Search actions
  SEARCH: 'Search',
  FILTER: 'Filter',
  SORT: 'Sort',
  
  // Error actions
  ERROR: 'Error',
  EXCEPTION: 'Exception',
  
  // Performance actions
  LOAD_TIME: 'Load Time',
  API_CALL: 'API Call'
} as const

/**
 * Analytics interface
 */
interface AnalyticsEvent {
  category: string
  action: string
  label?: string
  value?: number
  custom_parameters?: Record<string, any>
}

/**
 * E-commerce event interface
 */
interface EcommerceEvent {
  transaction_id: string
  value: number
  currency: string
  items: Array<{
    item_id: string
    item_name: string
    category: string
    quantity: number
    price: number
  }>
}

/**
 * User properties interface
 */
interface UserProperties {
  user_id?: string
  user_type?: 'guest' | 'customer' | 'admin'
  subscription_status?: string
  total_orders?: number
  total_spent?: number
  favorite_category?: string
}

/**
 * Analytics class
 */
class Analytics {
  private initialized = false
  private userId: string | null = null
  private sessionId: string | null = null

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  /**
   * Initialize analytics
   */
  async initialize(): Promise<void> {
    if (!analyticsConfig.enabled || this.initialized) {
      return
    }

    try {
      // Initialize Google Analytics
      if (analyticsConfig.googleAnalyticsId) {
        await this.initializeGoogleAnalytics()
      }

      // Initialize Google Tag Manager
      if (analyticsConfig.googleTagManagerId) {
        await this.initializeGoogleTagManager()
      }

      // Initialize Facebook Pixel
      if (analyticsConfig.facebookPixelId) {
        await this.initializeFacebookPixel()
      }

      // Initialize Hotjar
      if (analyticsConfig.hotjarId) {
        await this.initializeHotjar()
      }

      this.initialized = true
      console.log('Analytics initialized successfully')
    } catch (error) {
      console.error('Failed to initialize analytics:', error)
    }
  }

  /**
   * Track a custom event
   */
  track(event: AnalyticsEvent): void {
    if (!analyticsConfig.enabled || !this.initialized) {
      return
    }

    try {
      // Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', event.action, {
          event_category: event.category,
          event_label: event.label,
          value: event.value,
          custom_map: event.custom_parameters
        })
      }

      // Facebook Pixel
      if (typeof fbq !== 'undefined') {
        fbq('trackCustom', event.action, {
          category: event.category,
          label: event.label,
          value: event.value,
          ...event.custom_parameters
        })
      }

      // Console log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event:', event)
      }
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }

  /**
   * Track page view
   */
  trackPageView(pagePath: string, pageTitle?: string): void {
    if (!analyticsConfig.enabled || !this.initialized) {
      return
    }

    try {
      // Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('config', analyticsConfig.googleAnalyticsId!, {
          page_path: pagePath,
          page_title: pageTitle
        })
      }

      // Facebook Pixel
      if (typeof fbq !== 'undefined') {
        fbq('track', 'PageView')
      }

      // Track custom page view event
      this.track({
        category: eventCategories.NAVIGATION,
        action: eventActions.PAGE_VIEW,
        label: pagePath,
        custom_parameters: {
          page_title: pageTitle,
          session_id: this.sessionId
        }
      })
    } catch (error) {
      console.error('Failed to track page view:', error)
    }
  }

  /**
   * Track e-commerce event
   */
  trackEcommerce(event: EcommerceEvent): void {
    if (!analyticsConfig.enabled || !this.initialized) {
      return
    }

    try {
      // Google Analytics Enhanced Ecommerce
      if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
          transaction_id: event.transaction_id,
          value: event.value,
          currency: event.currency,
          items: event.items
        })
      }

      // Facebook Pixel Purchase
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Purchase', {
          value: event.value,
          currency: event.currency,
          content_ids: event.items.map(item => item.item_id),
          content_type: 'product'
        })
      }

      // Track custom purchase event
      this.track({
        category: eventCategories.ORDER,
        action: eventActions.ORDER_COMPLETE,
        label: event.transaction_id,
        value: event.value,
        custom_parameters: {
          currency: event.currency,
          item_count: event.items.length,
          items: event.items
        }
      })
    } catch (error) {
      console.error('Failed to track e-commerce event:', error)
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties): void {
    if (!analyticsConfig.enabled || !this.initialized) {
      return
    }

    try {
      this.userId = properties.user_id || null

      // Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('config', analyticsConfig.googleAnalyticsId!, {
          user_id: properties.user_id,
          custom_map: {
            user_type: properties.user_type,
            subscription_status: properties.subscription_status,
            total_orders: properties.total_orders,
            total_spent: properties.total_spent,
            favorite_category: properties.favorite_category
          }
        })
      }

      // Facebook Pixel
      if (typeof fbq !== 'undefined' && properties.user_id) {
        fbq('init', analyticsConfig.facebookPixelId!, {
          external_id: properties.user_id
        })
      }
    } catch (error) {
      console.error('Failed to set user properties:', error)
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: string, value: number, unit: string = 'ms'): void {
    this.track({
      category: eventCategories.PERFORMANCE,
      action: eventActions.LOAD_TIME,
      label: metric,
      value: value,
      custom_parameters: {
        unit: unit,
        timestamp: Date.now()
      }
    })
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: string): void {
    this.track({
      category: eventCategories.ERROR,
      action: eventActions.ERROR,
      label: error.message,
      custom_parameters: {
        error_name: error.name,
        error_stack: error.stack,
        context: context,
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
      }
    })
  }

  /**
   * Initialize Google Analytics
   */
  private async initializeGoogleAnalytics(): Promise<void> {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAnalyticsId}`
      document.head.appendChild(script)

      script.onload = () => {
        window.dataLayer = window.dataLayer || []
        function gtag(...args: any[]) {
          window.dataLayer.push(args)
        }
        window.gtag = gtag
        gtag('js', new Date())
        gtag('config', analyticsConfig.googleAnalyticsId!)
        resolve()
      }
    })
  }

  /**
   * Initialize Google Tag Manager
   */
  private async initializeGoogleTagManager(): Promise<void> {
    return new Promise((resolve) => {
      // GTM script
      const gtmScript = document.createElement('script')
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${analyticsConfig.googleTagManagerId}');
      `
      document.head.appendChild(gtmScript)

      // GTM noscript
      const noscript = document.createElement('noscript')
      noscript.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=${analyticsConfig.googleTagManagerId}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
      `
      document.body.insertBefore(noscript, document.body.firstChild)

      resolve()
    })
  }

  /**
   * Initialize Facebook Pixel
   */
  private async initializeFacebookPixel(): Promise<void> {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${analyticsConfig.facebookPixelId}');
        fbq('track', 'PageView');
      `
      document.head.appendChild(script)
      resolve()
    })
  }

  /**
   * Initialize Hotjar
   */
  private async initializeHotjar(): Promise<void> {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.innerHTML = `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${analyticsConfig.hotjarId},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `
      document.head.appendChild(script)
      resolve()
    })
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }
}

// Create singleton instance
export const analytics = new Analytics()

// Convenience functions
export const trackEvent = (event: AnalyticsEvent) => analytics.track(event)
export const trackPageView = (pagePath: string, pageTitle?: string) => analytics.trackPageView(pagePath, pageTitle)
export const trackEcommerce = (event: EcommerceEvent) => analytics.trackEcommerce(event)
export const setUserProperties = (properties: UserProperties) => analytics.setUserProperties(properties)
export const trackPerformance = (metric: string, value: number, unit?: string) => analytics.trackPerformance(metric, value, unit)
export const trackError = (error: Error, context?: string) => analytics.trackError(error, context)

export default analytics
