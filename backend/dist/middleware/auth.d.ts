import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
export interface JWTPayload {
    userId: string;
    role: string;
    iat: number;
    exp: number;
}
export declare const verifyToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authRateLimit: {
    windowMs: number;
    max: number;
    message: {
        success: boolean;
        message: string;
    };
    standardHeaders: boolean;
    legacyHeaders: boolean;
};
export declare const validatePassword: (password: string) => {
    isValid: boolean;
    message: string;
};
export declare const validateEmail: (email: string) => boolean;
export declare const validatePhone: (phone: string) => boolean;
//# sourceMappingURL=auth.d.ts.map