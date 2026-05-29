export interface IRealEstate {
    key: string;
    name: string;
    cnpj: string;
    address: string;
    commission: number;
    phone: string;
}

export interface IRealEstatePayload {
    name: string;
    cnpj: string;
    address: string;
    commission: number;
    phone: string;
}
