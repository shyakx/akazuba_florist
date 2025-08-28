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

// Node.js globals
declare var process: {
  env: NodeJS.ProcessEnv
  exit: (code?: number) => never
  on: (event: string, listener: (...args: any[]) => void) => void
}

declare var __dirname: string
declare var __filename: string
declare var console: {
  log: (...args: any[]) => void
  error: (...args: any[]) => void
  warn: (...args: any[]) => void
  info: (...args: any[]) => void
}

declare var Buffer: any
declare var global: any

// Node.js built-in modules
declare module 'path' {
  export function join(...paths: string[]): string
  export function extname(path: string): string
  export function dirname(path: string): string
  export function basename(path: string, ext?: string): string
  export function resolve(...paths: string[]): string
  export function normalize(path: string): string
  export function isAbsolute(path: string): boolean
  export function relative(from: string, to: string): string
}

declare module 'fs' {
  export function existsSync(path: string): boolean
  export function mkdirSync(path: string, options?: { recursive?: boolean }): void
  export function readFileSync(path: string, encoding?: string): string
  export function writeFileSync(path: string, data: string): void
  export function unlinkSync(path: string): void
  export function statSync(path: string): any
  export function readdirSync(path: string): string[]
}

export {}
