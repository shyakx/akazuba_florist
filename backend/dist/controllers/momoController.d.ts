import { Request, Response } from 'express';
declare class MoMoController {
    private baseURL;
    private apiKey;
    private apiUser;
    private targetEnvironment;
    private accessToken;
    private tokenExpiry;
    constructor();
    private getAccessToken;
    private formatPhoneNumber;
    private generateReferenceId;
    initiatePayment: (req: Request, res: Response) => Promise<void>;
    checkPaymentStatus: (req: Request, res: Response) => Promise<void>;
    getAccountBalance: (req: Request, res: Response) => Promise<void>;
}
export declare const momoController: MoMoController;
export {};
//# sourceMappingURL=momoController.d.ts.map