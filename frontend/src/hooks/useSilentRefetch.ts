import { useEffect } from 'react';

export function useSilentRefetch(refetchFn: () => void, timeSecond: number = 1) {
    useEffect(() => {
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                refetchFn(); 
            }
        }, timeSecond * 1000);

        return () => clearInterval(interval);
    }, [refetchFn, timeSecond]);
}
