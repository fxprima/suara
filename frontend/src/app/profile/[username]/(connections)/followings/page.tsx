'use client'

import UserFollowCard from "@/components/connections/UserFollowCard";
import useAuth from "@/hooks/auth/useAuth";
import { useFetchData } from "@/hooks/data/useFetchData";
import { useToast } from "@/hooks/ui/useToast";
import api from "@/services/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserPublicProfile } from "../../../../../../types/gema";
import { extractErrorMessage } from "@/utils/handleApiError";
import { useParams } from "next/navigation";

export default function FollowingsPage() {
  const params = useParams<{ username: string }>();
  const targetUsername = params.username;

  const { user } = useAuth();
  const { toasts, showToast } = useToast();

  const [followings, setFollowings] = useState<ConnectionUserType[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const [loading, setLoading] = useState({
    initialFetch: false,
    loadingNext: false
  })

  const { data: targetPublicData } =
    useFetchData<UserPublicProfile>(
      targetUsername ? `user/profile/${targetUsername}` : undefined
    );

  const inFlightRef = useRef(false);

  const fetchConnections = useCallback(
    async (opts? : { cursor?: string | null; append?: boolean }) => {
      if (!user?.id || !targetPublicData?.id || inFlightRef.current) return;

      inFlightRef.current = true;

      const append = opts?.append ?? false;
      const cursor = opts?.cursor ?? null;

      try {
        if (!append)
          setLoading((p) => ({...p, initialFetch: true}));
        else 
          setLoading((p) => ({...p, loadingNext: true}))

        const res = await api.get<ConnectionResponse>(
          `/follow/followings/${targetPublicData?.id}`,
          {
            params: {
              viewer: 'me',
              limit: 10,
              ...(cursor ? { cursor } : {}),
            },
            withCredentials: true,
          }
        );

        const payload = res.data;
        const newItems = payload?.data ?? [];

        setHasNext(Boolean(payload?.hasNext));
        setNextCursor(payload?.nextCursor ?? null);

        setFollowings((prev) => {
          if (!append) return newItems;

          const merged = [...prev, ...newItems];
          const map = new Map<string, ConnectionUserType>();

          for (const g of merged) map.set(g.id, g);
          
          return Array.from(map.values());
        })

      } catch (err) {
        console.error('[fetchFeed]', err);
        showToast(extractErrorMessage(err), 'error');
      } finally {
        if (!append)
          setLoading((p) => ({...p, initialFetch: false}));
        else 
          setLoading((p) => ({...p, loadingNext: false}))

        inFlightRef.current = false;
      }
    },
    [user?.id, targetPublicData?.id, showToast]
  )

    const resetAndReload = useCallback(async () => {
        setFollowings([]);
        setNextCursor(null);
        setHasNext(true);
        await fetchConnections({ cursor: null, append: false });
    }, [fetchConnections]);

    useEffect(() => {
        if (!user?.id) return;
        resetAndReload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, targetPublicData?.id]);


    const handleLoadMore = async () => {
        if (!hasNext || !nextCursor) return;
        
        await fetchConnections({ cursor: nextCursor, append: true });
    };

  return (
    <div>
      {
        followings.map((user) => (
          <UserFollowCard
            key = {user.id}
            onPage="followings"
            {...user}
          />
        ))
      }
      <div className="flex justify-center py-4">
          {hasNext ? (
              <button
                  type="button"
                  onClick={handleLoadMore}
                  className="btn btn-primary"
                  disabled={loading.loadingNext|| loading.initialFetch}
              >
                  {(loading.loadingNext || loading.initialFetch) && (
                      <span className="loading loading-spinner loading-sm" />
                  )}
                  {loading.loadingNext ? 'Loading...' : 'Load More'}
              </button>
          ) : (
              followings.length > 0 && (
                  <p className="text-center text-sm opacity-60">End of followings</p>
              )
          )}
      </div>
    </div>
  );
}
