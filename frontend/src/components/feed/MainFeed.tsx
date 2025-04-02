'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather } from '@fortawesome/free-solid-svg-icons';
import api from '@/services/api';
import { useState } from 'react';
import { useAutoGrow } from '@/hooks/useAutoGrow';
import { AxiosError } from 'axios';
import { extractErrorMessage } from '@/utils/handleApiError';
import { ToastMessage } from '../ui/toast/ToastMessage';
import { useToast } from '@/hooks/useToast';
import { GemaCard } from '../card/GemaCard';
import { useFetchData } from '@/hooks/useFetchData';
import { GemaType } from '../../../types/gema';

export default function MainFeed() {
    const [createGemaField, setCreateGemaField] = useState('');
    const textareaRef = useAutoGrow(createGemaField);
    const {
        data: gemas,
        loading: loadingFetchGema,
        error: errorFetchGema,
        refetch: refetchGema,
    } = useFetchData<GemaType[]>('/gema');

    const { toasts, showToast } = useToast();

    const [loading, setLoading] = useState({
        createGema: false,
    });

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
                {loadingFetchGema && (
                    <div className="flex justify-center items-center py-6">
                        <span className="loading loading-spinner loading-md text-primary"></span>
                    </div>
                )}
                {!loadingFetchGema
                    ? gemas?.map((gema) => (
                          <GemaCard
                              key={gema.id}
                              authorName={`${gema.author.firstname} ${gema.author?.lastname}`}
                              username={gema.author.username}
                              avatar={
                                  gema.author.image ??
                                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTBA57d__PXonmFyFDla6f2WRtfPvP9an3YA&s'
                              }
                              content={gema.content}
                              media={gema.media}
                              createdAt={gema.createdAt}
                              viewsCount={gema.viewsCount}
                              likesCount={gema.likesCount}
                              repliesCount={gema.repliesCount}
                          />
                      ))
                    : null}
            </div>
        </>
    );
}
