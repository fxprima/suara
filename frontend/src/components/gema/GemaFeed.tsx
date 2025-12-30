'use client';

import { useMemo, useState } from 'react';
import { GemaCard } from '@/components/gema/GemaCard';
import { ReplyGemaModal } from '@/components/gema/ReplyGemaModal';
import { handleReply } from '@/utils/handleReply';
import { useToast } from '@/hooks/ui/useToast';
import { ToastMessage } from '@/components/common/toast/ToastMessage';
import { extractErrorMessage } from '@/utils/handleApiError';
import { GemaType } from '../../../types/gema';
import { useCursorGemaFeed } from '@/hooks/data/useCursorGemaFeed';

export default function GemaFeed(props: {
  endpoint: string | ((ctx: { cursor: string | null; limit: number }) => string);
  limit?: number;
  enabled?: boolean;
  reloadToken?: any;
  params?: Record<string, any>;
  emptyText?: string;
  header?: React.ReactNode;
}) {
  const { toasts, showToast } = useToast();
  const [replyToGema, setReplyToGema] = useState<GemaType | null>(null);

  const {
    gemas,
    hasNext,
    loadingInitial,
    loadingMore,
    loadMore,
    patchGema,
  } = useCursorGemaFeed({
    endpoint: props.endpoint,
    limit: props.limit ?? 5,
    enabled: props.enabled ?? true,
    reloadToken: props.reloadToken,
    params: props.params,
    onError: (err) => {
      console.error('[GemaFeed]', err);
      showToast(extractErrorMessage(err), 'error');
    },
  });

  const emptyText = useMemo(
    () => props.emptyText ?? 'Belum ada konten.',
    [props.emptyText]
  );

  const bumpReplyCount = (parentId?: string) => {
    if (!parentId) return;
    patchGema(parentId, (g) => ({
      ...g,
      repliesCount: (g.repliesCount ?? 0) + 1,
    }));
  };

  const handleSubmitReply = async (formData: FormData) => {
    await handleReply({
      formData,
      parentId: replyToGema?.id,
      refetchFn: async () => {},
      showToast,
      onSuccess: () => {
        bumpReplyCount(replyToGema?.id);
        setReplyToGema(null);
      },
    });
  };

  return (
    <>
      <ToastMessage toasts={toasts} />

      {props.header}

      <div className="mt-6 space-y-4">
        {!loadingInitial && gemas.length === 0 && (
          <p className="text-center text-sm opacity-60">{emptyText}</p>
        )}

        {loadingInitial && (
          <div className="flex justify-center items-center py-6">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        )}

        {!loadingInitial
          ? gemas.map((gema) => (
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

        <div className="flex justify-center py-4">
          {hasNext ? (
            <button
              type="button"
              onClick={loadMore}
              className="btn btn-primary"
              disabled={loadingMore || loadingInitial}
            >
              {(loadingMore || loadingInitial) && (
                <span className="loading loading-spinner loading-sm" />
              )}
              {loadingMore ? 'Loading...' : 'Load More'}
            </button>
          ) : (
            gemas.length > 0 && (
              <p className="text-center text-sm opacity-60">End of feed 🙂</p>
            )
          )}
        </div>
      </div>
    </>
  );
}
