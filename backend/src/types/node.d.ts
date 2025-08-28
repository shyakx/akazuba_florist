/// <reference types="node" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      PORT?: string
      DATABASE_URL?: string
      JWT_SECRET?: string
      CORS_ORIGIN?: string
      FRONTEND_URL?: string
      DB_HOST?: string
      DB_PORT?: string
      DB_NAME?: string
      DB_USER?: string
      DB_PASSWORD?: string
      SMTP_HOST?: string
      SMTP_PORT?: string
      SMTP_USER?: string
      SMTP_PASS?: string
      CLOUDINARY_CLOUD_NAME?: string
      CLOUDINARY_API_KEY?: string
      CLOUDINARY_API_SECRET?: string
      PAYMENT_SECRET_KEY?: string
      PAYMENT_PUBLIC_KEY?: string
      MOMO_API_URL?: string
      MOMO_API_KEY?: string
      MOMO_API_USER?: string
      MOMO_ENVIRONMENT?: string
      LOG_LEVEL?: string
    }
  }
}

export {}
