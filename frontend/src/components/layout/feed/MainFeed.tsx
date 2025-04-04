'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather } from '@fortawesome/free-solid-svg-icons';
import api from '@/services/api';
import { useState } from 'react';
import { useAutoGrow } from '@/hooks/ui/useAutoGrow';
import { extractErrorMessage } from '@/utils/handleApiError';
import { ToastMessage } from '../../common/toast/ToastMessage';
import { useToast } from '@/hooks/ui/useToast';
import { GemaCard } from '../../gema/GemaCard';
import { useFetchData } from '@/hooks/data/useFetchData';
import { GemaType } from '../../../../types/gema';
import { ReplyGemaModal } from '../../gema/ReplyGemaModal';
import { handleReply } from '@/utils/handeReply';
import { useSilentRefetch } from '@/hooks/data/useSilentRefetch';

export default function MainFeed() {
    const [createGemaField, setCreateGemaField] = useState('');
    const [replyToGema, setReplyToGema] = useState<GemaType | null>(null);
    const textareaRef = useAutoGrow(createGemaField);
    const {
        data: gemas,
        loading: loadingFetchGema,
        error: errorFetchGema,
        refetch: refetchGema,
        silentRefetch: silentRefetchGema,
    } = useFetchData<GemaType[]>('/gema');

    const { toasts, showToast } = useToast();

    useSilentRefetch(silentRefetchGema);

    const [loading, setLoading] = useState({
        createGema: false,
    });

    const handleSubmitReply = async (text: string) => {
        await handleReply({
            text: text,
            parentId: replyToGema?.id,
            refetchFn: refetchGema,
            showToast: showToast,
            onSuccess: () => setReplyToGema(null),
        });
    };

    const handlePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            setLoading((prev) => ({ ...prev, createGema: true }));

            console.log(loading);
            const data = {
                content: createGemaField,
            };
            console.log(data);
            const res = await api.post('/gema', data, { withCredentials: true });
            console.log('Res Create Gema: ', res);

            setCreateGemaField('');
            showToast('You have successfully posted your Suara!', 'success');
            refetchGema();
        } catch (error: unknown) {
            showToast(extractErrorMessage(error), 'error');
        } finally {
            setLoading((prev) => ({ ...prev, createGema: false }));
        }
    };

    return (
        <>
            <ToastMessage toasts={toasts} />
            <div className="border-b border-base-300 pb-4">
                <div className="flex items-center space-x-2 mb-4">
                    <FontAwesomeIcon icon={faFeather} className="h-5 w-5 opacity-50" />
                    <textarea
                        ref={textareaRef}
                        placeholder="What is going on?"
                        className="textarea textarea-bordered w-full resize-none min-h-0 overflow-hidden"
                        rows={1}
                        value={createGemaField}
                        onChange={(e) => setCreateGemaField(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={handlePost}>
                    {loading.createGema && (
                        <span className="loading loading-spinner loading-sm"></span>
                    )}
                    {loading.createGema ? 'Menggema...' : 'Gema'}
                </button>
            </div>

            <div className="mt-6 space-y-4">
                {!loadingFetchGema && gemas?.length === 0 && (
                    <p className="text-center text-sm text-gray-500">
                        Gema? Gema? …Anyone? Start one!
                    </p>
                )}

                {loadingFetchGema && (
                    <div className="flex justify-center items-center py-6">
                        <span className="loading loading-spinner loading-md text-primary"></span>
                    </div>
                )}
                {!loadingFetchGema
                    ? gemas?.map((gema) => (
                          <GemaCard
                              id={gema.id}
                              key={gema.id}
                              authorName={`${gema.author.firstname} ${gema.author?.lastname}`}
                              username={gema.author.username}
                              avatar={gema.author.avatar ?? '/default-avatar.svg'}
                              content={gema.content}
                              media={gema.media}
                              createdAt={gema.createdAt}
                              viewsCount={gema.viewsCount}
                              likesCount={gema.likesCount}
                              repliesCount={gema.repliesCount}
                              onReply={() => setReplyToGema(gema)} // trigger set gema.
                          />
                      ))
                    : null}

                {/* ketika replytogema udah ke set, replytogema jadi true. */}
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
