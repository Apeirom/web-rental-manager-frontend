import { IUser } from './user';

export interface ILoginResponse {
    token: ITokenResponse;
    user: IUser;
}

interface ITokenResponse {
    access_token: string;
    token_type: string;
}

export interface IAuthPayload {
    email: string;
    password: string;
}
