import { IProperty } from './property';
import { ITenant } from './tenant';
import { IRealEstate } from './real_estate';
import { IGuarantee } from './guarantee';

export interface IContract {
    key: string;
    rent_amount: number;
    room_name?: string | null;
    file_path?: string | null;

    status: string;

    property: IProperty;
    tenant: ITenant;
    real_estate?: IRealEstate | null;
    guarantee?: IGuarantee;
}

export interface IContractPayload {
    guarantee_type: string;
    rental_deposit: number;
    rent_amount: number;
    room_name?: string | null;
    status?: string;
    file_path?: string | null;
    property_key: string;
    tenant_key: string;
    real_estate_key?: string | null;
    guarantee_key?: string;
}
