import { AcceptAny } from "./type";
interface Response {
    status: string;
    code: number;
    timestamp: number;
}

export interface HttpResponse extends Response {
    data: Record<string, AcceptAny> | null;
    error: Record<string, AcceptAny> | null;
    message?: string | null;
}
export interface INODEMAILER_CONFIG {
    service: string;
    auth: {
        user: string;
        pass: string;
    };
}
export interface ICartArray{
        foodId: any;
        name: any;
        price: any;
        quantity: number;
    
}
