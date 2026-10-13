export interface IOwner {
    key: string;
    name: string;
    document_number: string | null;
}

export interface IOwnerPayload {
    name: string;
    document_number?: string | null;
}
