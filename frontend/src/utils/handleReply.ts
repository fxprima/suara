import api from '@/services/api';
import { extractErrorMessage } from './handleApiError';

type HandleReplyArgs = {
    formData: FormData;
    parentId?: string;
    refetchFn: () => void;
    showToast: (message: string, type: 'success' | 'error') => void;
    onSuccess?: () => void;
};

export const handleReply = async ({
    formData,
    parentId,
    refetchFn,
    showToast,
    onSuccess,
}: HandleReplyArgs) => {
    try {
        const data = new FormData();
        data.append('content', formData.get('content') as string);
        if (formData.getAll('media').length > 0) {
            (formData.getAll('media') as File[]).forEach((file) => {
                data.append('media', file);
            });
        }

        data.append('parentId', parentId || '');

        console.log('FORM DATA:', data.get('content'), data.getAll('media'), data.get('parentId'));

        await api.post(
            '/gema',
            data,
            { withCredentials: true }
        );

        refetchFn();
        showToast('Reply berhasil dikirim!', 'success');
        if (onSuccess) onSuccess();
    } catch (error) {
        showToast(extractErrorMessage(error), 'error');
    }
};
