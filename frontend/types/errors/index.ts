export interface AxiosErrorResponse {
    response?: {
        data?: {
            message?: string | string[];
        };
    };
    message?: string;
}

export interface ApiErrorResponse {
    statusCode: number;
    message: string | string[];
    error?: string; 
}
