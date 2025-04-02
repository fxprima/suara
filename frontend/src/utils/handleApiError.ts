import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../../types/errors/api-error-response';

export function extractErrorMessage(error: unknown): string {
    const err = error as AxiosError<ApiErrorResponse>;

    if (!err?.isAxiosError) return 'Terjadi kesalahan tak terduga';

    const msg = err.response?.data?.message;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg)) return msg[0];

    return err.message || 'Terjadi kesalahan tak dikenal';
}
