import { useEffect, useRef } from "react";

export function useAutoGrow (value: string) {
    const ref = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        const el = ref.current;
        if(el) {
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`
        }
    }, [value])

    return ref;
}