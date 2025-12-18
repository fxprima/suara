'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import api from '@/services/api';
import { useState, useRef } from 'react';
import { useAutoGrow } from '@/hooks/ui/useAutoGrow';
import { extractErrorMessage } from '@/utils/handleApiError';
import { ToastMessage } from '../../common/toast/ToastMessage';
import { useToast } from '@/hooks/ui/useToast';
import { GemaCard } from '../../gema/GemaCard';
import { useFetchData } from '@/hooks/data/useFetchData';
import { GemaType } from '../../../../types/gema';
import { ReplyGemaModal } from '../../gema/ReplyGemaModal';
import { handleReply } from '@/utils/handleReply';
import { useSilentRefetch } from '@/hooks/data/useSilentRefetch';
import MediaPicker from '@/components/common/media/MediaPicker';
import useAuth from '@/hooks/auth/useAuth';

export default function MainFeed() {

    const [createGemaField, setCreateGemaField] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]); 
    const [replyToGema, setReplyToGema] = useState<GemaType | null>(null);
    const [loading, setLoading] = useState({ createGema: false });

    const textareaRef = useAutoGrow(createGemaField);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {user} = useAuth();

    const {
        data: gemas,
        loading: loadingFetchGema,
        refetch: refetchGema,
        silentRefetch: silentRefetchGema,
    } = useFetchData<GemaType[]>(`/gema/${user?.id}/feed`);


    const { toasts, showToast } = useToast();

    useSilentRefetch(silentRefetchGema);

    const clearMedia = () => setSelectedFiles([]);

    const handlePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!createGemaField.trim() && !selectedFiles.length) return;

        try {
            setLoading((p) => ({ ...p, createGema: true }));
            const formData = new FormData();
            formData.append('content', createGemaField);
            selectedFiles.forEach((file) => formData.append('media', file));

            const res = await api.post('/gema', formData, { withCredentials: true });
            console.log('Res Create Gema:', res);

            setCreateGemaField('');
            clearMedia();
            showToast('You have successfully posted your Suara!', 'success');
            refetchGema();
        } catch (err) {
            console.error(err);
            showToast(extractErrorMessage(err), 'error');
        } finally {
            setLoading((p) => ({ ...p, createGema: false }));
        }
    };

    const handleSubmitReply = async (formData: FormData) => {
        await handleReply({
            formData: formData,
            parentId: replyToGema?.id,
            refetchFn: refetchGema,
            showToast,
            onSuccess: () => setReplyToGema(null),
        });
    };

    return (
        <>
            <ToastMessage toasts={toasts} />

            <div className="border-b border-base-300 pb-4">
                <div className="flex items-start space-x-2 mb-4">
                    <FontAwesomeIcon
                        icon={faFeather}
                        className="h-5 w-5 opacity-50 translate-y-[2px]"
                    />

                    <div className="w-full">
                        <textarea
                            ref={textareaRef}
                            placeholder="What is going on?"
                            className="textarea textarea-bordered w-full resize-none min-h-0 overflow-hidden py-2 leading-snug"
                            rows={1}
                            value={createGemaField}
                            onChange={(e) => setCreateGemaField(e.target.value)}
                        />

                        <MediaPicker
                            files={selectedFiles}
                            onChange={setSelectedFiles}
                            max={4}
                            showToast={showToast}
                            className="w-full"
                        />
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handlePost}
                    disabled={loading.createGema}
                >
                    {loading.createGema && <span className="loading loading-spinner loading-sm" />}
                    {loading.createGema ? 'Menggema...' : 'Gema'}
                </button>
            </div>

            {/* feed */}
            <div className="mt-6 space-y-4">
                {!loadingFetchGema && gemas?.length === 0 && (
                    <p className="text-center text-sm text-gray-500">
                        Gema? Gema? …Anyone? Start one!
                    </p>
                )}

                {loadingFetchGema && (
                    <div className="flex justify-center items-center py-6">
                        <span className="loading loading-spinner loading-md text-primary" />
                    </div>
                )}
                {!loadingFetchGema
                    ? gemas?.map((gema) => (
                          <GemaCard
                              key={gema.id}
                              gema={gema}
                              onReply={() => setReplyToGema(gema)}
                          />
                      ))
                    : null}

                {replyToGema && (
                    <ReplyGemaModal
                        isOpen={true}
                        gema={replyToGema}
                        onClose={() => setReplyToGema(null)}
                        onSubmitReply={handleSubmitReply}
                    />
                )}
            </div>
        </>
    );
}
