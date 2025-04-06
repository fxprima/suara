import api from '@/services/api';
import { extractErrorMessage } from './handleApiError';

type HandleReplyArgs = {
    text: string;
    parentId?: string;
    refetchFn: () => void;
    showToast: (message: string, type: 'success' | 'error') => void;
    onSuccess?: () => void;
};

export const handleReply = async ({
    text,
    parentId,
    refetchFn,
    showToast,
    onSuccess,
}: HandleReplyArgs) => {
    try {
        await api.post(
            '/gema',
            {
                content: text,
                parentId,
            },
            { withCredentials: true }
        );

        refetchFn();
        showToast('Reply berhasil dikirim!', 'success');
        if (onSuccess) onSuccess();
    } catch (error) {
        showToast(extractErrorMessage(error), 'error');
    }
};
