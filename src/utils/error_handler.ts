import axios from 'axios';
import { message } from 'antd';

export interface IApiErrorDetails {
    tenant_name?: string;
    property_name?: string;
    month_ref?: number;
    year_ref?: number;
    duplicate_type?: 'database' | 'intra_batch';
    [key: string]: unknown;
}

export interface IApiErrorDetailObject {
    code?: string;
    message?: string;
    translation?: string;
    details?: IApiErrorDetails;
}

export interface IApiErrorPayload {
    detail?: IApiErrorDetailObject | string;
}

export const extractApiErrorCode = (error: unknown): string | undefined => {
    if (!axios.isAxiosError(error)) {
        return undefined;
    }

    const responseData = error.response?.data as IApiErrorPayload | undefined;
    if (
        responseData &&
        typeof responseData === 'object' &&
        responseData.detail &&
        typeof responseData.detail === 'object'
    ) {
        return responseData.detail.code;
    }

    return undefined;
};

export const extractApiErrorData = (
    error: unknown
): IApiErrorDetailObject | undefined => {
    if (!axios.isAxiosError(error)) {
        return undefined;
    }

    const responseData = error.response?.data as IApiErrorPayload | undefined;
    if (
        responseData &&
        typeof responseData === 'object' &&
        responseData.detail &&
        typeof responseData.detail === 'object'
    ) {
        return responseData.detail;
    }

    return undefined;
};

export const extractApiErrorMessage = async (
    error: unknown,
    fallbackMessage: string
): Promise<string> => {
    if (!axios.isAxiosError(error)) {
        if (error instanceof Error && error.message) {
            return error.message;
        }
        return fallbackMessage;
    }

    let responseData = error.response?.data;

    if (responseData instanceof Blob) {
        try {
            const rawText = await responseData.text();
            responseData = JSON.parse(rawText) as unknown;
        } catch {
            return fallbackMessage;
        }
    }

    if (
        typeof responseData === 'object' &&
        responseData !== null &&
        'detail' in responseData
    ) {
        const { detail } = responseData as IApiErrorPayload;

        if (
            typeof detail === 'object' &&
            detail !== null &&
            typeof detail.translation === 'string' &&
            detail.translation.trim().length > 0
        ) {
            return detail.translation;
        }

        if (typeof detail === 'string' && detail.trim().length > 0) {
            return detail;
        }
    }

    return fallbackMessage;
};

export const notifyApiError = async (
    error: unknown,
    fallbackMessage: string
): Promise<void> => {
    const errorMessage = await extractApiErrorMessage(error, fallbackMessage);
    message.error(errorMessage);
};
