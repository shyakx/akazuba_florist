import { Request, Response } from 'express';
declare class PaymentController {
    initiatePayment: (req: Request, res: Response) => Promise<void>;
    checkPaymentStatus: (req: Request, res: Response) => Promise<void>;
    updatePaymentStatus: (req: Request, res: Response) => Promise<void>;
    getPaymentMethods: (req: Request, res: Response) => Promise<void>;
}
declare const _default: PaymentController;
export default _default;
//# sourceMappingURL=paymentController.d.ts.map