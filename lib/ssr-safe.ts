// SSR-safe utility functions to prevent server-side rendering errors

export const isBrowser = typeof window !== 'undefined'

export const safeGetLocation = () => {
  if (!isBrowser) return null
  try {
    return window.location
  } catch (error) {
    console.warn('Failed to access window.location:', error)
    return null
  }
}

export const safeGetLocalStorage = () => {
  if (!isBrowser) return null
  try {
    return localStorage
  } catch (error) {
    console.warn('Failed to access localStorage:', error)
    return null
  }
}

export const safeGetSessionStorage = () => {
  if (!isBrowser) return null
  try {
    return sessionStorage
  } catch (error) {
    console.warn('Failed to access sessionStorage:', error)
    return null
  }
}

export const safeGetDocument = () => {
  if (!isBrowser) return null
  try {
    return document
  } catch (error) {
    console.warn('Failed to access document:', error)
    return null
  }
}

// Safe API base URL function
export const getSafeApiBaseUrl = (): string => {
  // Check if we have an explicit API URL set
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }

  if (!isBrowser) {
    // Server-side: default to production URL
    return 'https://akazuba-backend-api.onrender.com/api/v1'
  }

  try {
    const location = safeGetLocation()
    if (!location) {
      return 'https://akazuba-backend-api.onrender.com/api/v1'
    }

    const hostname = location.hostname
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
    
    if (isLocalhost) {
      // Always use local backend when running on localhost
      return 'http://localhost:5000/api/v1'
    } else {
      // Production environment
      return 'https://akazuba-backend-api.onrender.com/api/v1'
    }
  } catch (error) {
    console.warn('Failed to determine API base URL, using fallback:', error)
    return 'https://akazuba-backend-api.onrender.com/api/v1'
  }
}
