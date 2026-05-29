import { IProperty } from './property';
import { ITenant } from './tenant';
import { IRealEstate } from './real_estate';
import { IGuarantor } from './guarantor';
import { IBailInsurance } from './bail_insurance';

export interface IContract {
    key: string;
    rental_deposit: number;
    rent_amount: number;
    room_name?: string | null;
    file_path?: string | null;

    guarantee_type: string;
    status: string;

    property: IProperty;
    tenant: ITenant;

    real_estate?: IRealEstate | null;
    guarantor?: IGuarantor | null;
    bail_insurance?: IBailInsurance | null;
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
    guarantor_key?: string | null;
    bail_insurance_key?: string | null;
}
