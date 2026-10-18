import { IPayment } from './payment';
import { IExtract, IExtractPayload } from './extract';

export interface IExtractBatch {
    key: string;
    total_net_transfer: number;
    file_path?: string;
    status: 'linked' | 'unlinked';
    extracts: IExtract[];
    payment?: IPayment;
}

export interface IExtractBatchPayload {
    file_path?: string | null;
    extracts: IExtractPayload[];
}
