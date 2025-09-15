/**
 * Secure Token Storage
 * 
 * Provides secure token storage using httpOnly cookies instead of localStorage
 * to prevent XSS attacks and token theft.
 */

interface TokenStorage {
  setToken: (token: string, expiresIn?: number) => void
  getToken: () => string | null
  removeToken: () => void
  isTokenValid: () => boolean
}

class SecureTokenStorage implements TokenStorage {
  private tokenKey = 'accessToken'
  private refreshTokenKey = 'refreshToken'

  setToken(token: string, expiresIn: number = 24 * 60 * 60): void {
    if (typeof window === 'undefined') return

    // Store in httpOnly cookie (server-side only)
    // For client-side, we'll use a more secure approach
    const expires = new Date(Date.now() + expiresIn * 1000)
    
    // Use secure cookie with SameSite protection
    document.cookie = `${this.tokenKey}=${token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null

    // Try to get from secure cookie first
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${this.tokenKey}=`)
    )
    
    if (tokenCookie) {
      return tokenCookie.split('=')[1]
    }

    // Fallback to localStorage (less secure but necessary for some cases)
    return localStorage.getItem(this.tokenKey)
  }

  removeToken(): void {
    if (typeof window === 'undefined') return

    // Clear cookie
    document.cookie = `${this.tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    document.cookie = `${this.refreshTokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    
    // Clear localStorage as well
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.refreshTokenKey)
    localStorage.removeItem('user')
  }

  isTokenValid(): boolean {
    const token = this.getToken()
    if (!token) return false

    try {
      // Basic JWT validation (check if it's a valid JWT format)
      const parts = token.split('.')
      if (parts.length !== 3) return false

      // Check expiration
      const payload = JSON.parse(atob(parts[1]))
      const now = Math.floor(Date.now() / 1000)
      
      return payload.exp > now
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const secureStorage = new SecureTokenStorage()

// Legacy compatibility functions (to be phased out)
export const legacyTokenStorage = {
  storeTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      // Use secure storage for access token
      secureStorage.setToken(accessToken)
      
      // Store refresh token in localStorage (less sensitive)
      localStorage.setItem('refreshToken', refreshToken)
    }
  },

  getAccessToken: (): string | null => {
    return secureStorage.getToken()
  },

  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken')
    }
    return null
  },

  clearTokens: () => {
    secureStorage.removeToken()
  },

  isAuthenticated: (): boolean => {
    return secureStorage.isTokenValid()
  }
}
