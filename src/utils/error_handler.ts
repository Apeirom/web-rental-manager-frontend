import axios from 'axios';
import { message } from 'antd';

interface IApiErrorDetailObject {
    code?: string;
    message?: string;
    translation?: string;
}

interface IApiErrorPayload {
    detail?: IApiErrorDetailObject | string;
}

/**
 * Extrai a mensagem amigável traduzida retornada pela API (detail.translation) ou recorre ao fallback.
 */
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

    // Lida com erros ocorridos em requisições com responseType: 'blob'
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

        // Prioridade máxima: detail.translation (erros customizados da API)
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

/**
 * Extrai a tradução do erro da API e a exibe em um toast do Ant Design (message.error).
 */
export const notifyApiError = async (
    error: unknown,
    fallbackMessage: string
): Promise<void> => {
    const errorMessage = await extractApiErrorMessage(error, fallbackMessage);
    message.error(errorMessage);
};
