'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import api from '@/services/api';
import { GemaType } from '../../../types/gema';

export type GemaCursorResponse = {
  data: GemaType[];
  nextCursor?: string | null;
  hasNext?: boolean;
};

type Endpoint =
  | string
  | ((ctx: { cursor: string | null; limit: number }) => string);

export function useCursorGemaFeed(opts: {
  endpoint: Endpoint;
  limit?: number;
  enabled?: boolean;
  reloadToken?: any; 
  params?: Record<string, any>;
  onError?: (err: unknown) => void;
}) {
  const { endpoint, limit = 5, enabled = true, reloadToken, params, onError } = opts;

  const [gemas, setGemas] = useState<GemaType[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);

  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const inFlightRef = useRef(false);

  const resolveUrl = useCallback(
    (cursor: string | null) => {
      if (typeof endpoint === 'function') return endpoint({ cursor, limit });
      return endpoint;
    },
    [endpoint, limit]
  );

  const fetchPage = useCallback(
    async (arg?: { cursor?: string | null; append?: boolean }) => {
      if (!enabled) return;
      if (inFlightRef.current) return;

      const append = arg?.append ?? false;
      const cursor = arg?.cursor ?? null;

      inFlightRef.current = true;
      try {
        if (!append) setLoadingInitial(true);
        else setLoadingMore(true);

        const url = resolveUrl(cursor);

        const res = await api.get<GemaCursorResponse>(url, {
          params: {
            limit,
            ...(params ?? {}),
            ...(cursor ? { cursor } : {}),
          },
          withCredentials: true,
        });

        const payload = res.data;
        const newItems = payload?.data ?? [];

        setHasNext(Boolean(payload?.hasNext));
        setNextCursor(payload?.nextCursor ?? null);

        setGemas((prev) => {
          if (!append) return newItems;

          const merged = [...prev, ...newItems];
          const map = new Map<string, GemaType>();
          for (const g of merged) map.set(g.id, g);
          return Array.from(map.values());
        });
      } catch (err) {
        onError?.(err);
      } finally {
        if (!append) setLoadingInitial(false);
        else setLoadingMore(false);
        inFlightRef.current = false;
      }
    },
    [enabled, limit, onError, params, resolveUrl]
  );

  const reload = useCallback(async () => {
    setGemas([]);
    setNextCursor(null);
    setHasNext(true);
    await fetchPage({ cursor: null, append: false });
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!hasNext || !nextCursor) return;
    await fetchPage({ cursor: nextCursor, append: true });
  }, [fetchPage, hasNext, nextCursor]);

  const patchGema = useCallback((gemaId: string, updater: (g: GemaType) => GemaType) => {
    setGemas((prev) => prev.map((g) => (g.id === gemaId ? updater(g) : g)));
  }, []);

  useEffect(() => {
    if (!enabled) return;
    reload();
  }, [enabled, endpoint, reloadToken]);

  return {
    gemas,
    setGemas,
    nextCursor,
    hasNext,
    loadingInitial,
    loadingMore,
    fetchPage,
    reload,
    loadMore,
    patchGema,
  };
}
