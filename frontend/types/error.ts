export interface AxiosErrorResponse {
    response?: {
    data?: {
        message?: string | string[];
    };
    };
    message?: string;
}
