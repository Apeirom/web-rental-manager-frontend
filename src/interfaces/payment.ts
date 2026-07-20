export interface IPayment {
    key: string;
    payment_date: string;
    amount: number;
    status: 'linked' | 'unlinked';
    extract_batch_key?: string | null;
}

export interface IPaymentCreatePayload {
    payment_date: string;
    amount: number;
}

export interface IPaymentUpdatePayload {
    payment_date: string;
    amount: number;
    extract_batch_key?: string | null;
}

export interface IPaymentReconciliation {
    status: 'pending' | 'success' | 'alreadyLinked';
    message: string;
    candidates?: IPayment[] | null;
}

export interface GetPaymentsParams {
    skip?: number;
    limit?: number;
    amount?: number;
    start_date?: string;
    end_date?: string;
    is_linked?: boolean;
}
