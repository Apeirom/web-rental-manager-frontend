import { IOwner } from './owner';

export interface IProperty {
    key: string;
    property_name: string;
    owner: IOwner;
    address: string;
    room_count: number;
}

export interface IPropertyPayload {
    property_name: string;
    owner_key: string;
    address: string;
    room_count: number;
}
