import { useEffect } from 'react';

/**
 * A custom React hook that periodically invokes a refetch function when the document is visible.
 *
 * @param refetchFn - A function to be called periodically when the document is in a visible state.
 * @param timeSecond - The interval time in seconds for invoking the `refetchFn`. Defaults to 1 second.
 *
 * @example
 * import { useSilentRefetch } from './hooks/data/useSilentRefetch';
 *
 * function MyComponent() {
 *     const refetchData = () => {
 *         console.log('Refetching data...');
 *         // Add your data fetching logic here
 *     };
 *
 *     useSilentRefetch(refetchData, 5); // Refetch every 5 seconds when the document is visible
 *
 *     return <div>My Component</div>;
 * }
 * 
 *
 * @remarks
 * This hook uses `setInterval` to periodically call the `refetchFn` function. It ensures that
 * the function is only called when the document's visibility state is `visible`. The interval
 * is cleared when the component unmounts or when the dependencies change.
 */
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
