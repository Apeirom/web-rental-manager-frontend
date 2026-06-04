export interface IUser {
    key: string;
    name: string;
    email: string;
    role: string;
}

export interface IUserUpdatePayload {
    name?: string;
    email?: string;
    password?: string;
}

export interface IUserCreatePayload {
    name: string;
    email: string;
    password: string;
}
