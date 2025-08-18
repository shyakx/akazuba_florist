import { Request, Response } from 'express';
declare class PaymentController {
    private baseURL;
    private secretKey;
    constructor();
    initiatePayment: (req: Request, res: Response) => Promise<void>;
    verifyPayment: (req: Request, res: Response) => Promise<void>;
    getBankTransferDetails: (req: Request, res: Response) => Promise<void>;
    handleWebhook: (req: Request, res: Response) => Promise<void>;
    private handlePaymentSuccess;
    private handlePaymentFailure;
    private handleTransferSuccess;
    private verifyWebhookSignature;
}
export declare const paymentController: PaymentController;
export {};
//# sourceMappingURL=paymentController.d.ts.map