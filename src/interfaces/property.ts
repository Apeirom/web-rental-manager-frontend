import { IOwner } from './owner';

export interface IProperty {
    key: string;
    property_name: string;
    equity_participations: IEquityParticipation[];
    address: string;
    room_count: number;
}

export interface IEquityParticipation {
    owner: IOwner;
    participation_percentage: number;
}

export interface IEquityParticipationPayload {
    owner_key: string;
    participation_percentage: number;
}

export interface IPropertyPayload {
    property_name: string;
    equity_participations: IEquityParticipationPayload[];
    address: string;
    room_count: number;
}
