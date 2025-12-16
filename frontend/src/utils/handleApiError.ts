import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../../types/errors';

/**
 * extractErrorMessage - Utility untuk mengekstrak pesan error dari AxiosError (dengan tipe ApiErrorResponse).
 *
 * @param {unknown} error - Error object yang dilempar dari try/catch (umumnya dari Axios)
 * @returns {string} - Pesan error yang bisa ditampilkan ke user
 *
 *  Prioritas urutan pesan:
 *  1. Jika message string → langsung return
 *  2. Jika message array → ambil elemen pertama
 *  3. Jika bukan AxiosError → return fallback "Terjadi kesalahan tak terduga"
 *
 *  Contoh penggunaan:
 * try {
 *   await api.get('/something');
 * } catch (err) {
 *   const msg = extractErrorMessage(err);
 *   showToast(msg, 'error')
 * }
 */
export function extractErrorMessage(error: unknown): string {
    const err = error as AxiosError<ApiErrorResponse>;

    if (!err?.isAxiosError) return 'Terjadi kesalahan tak terduga';

    const msg = err.response?.data?.message;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg)) return msg[0];

    return err.message || 'Terjadi kesalahan tak dikenal';
}
