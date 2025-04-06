import { useEffect, useRef } from "react";

/**
 * useAutoGrow - Custom hook untuk membuat `<textarea>` otomatis menyesuaikan tinggi (auto-expand)
 * berdasarkan isi teks (value) saat user mengetik.
 *
 * @param {string} value - Value dari textarea yang dipantau (biasanya dari state)
 * @returns {React.RefObject<HTMLTextAreaElement>} - Ref yang bisa langsung di-assign ke `<textarea ref={...}>`
 *
 * 📦 Contoh penggunaan:
 * const ref = useAutoGrow(value);
 * <textarea ref={ref} value={value} onChange={...} />
 *
 * 🔥 Fitur:
 * - Saat `value` berubah, tinggi textarea akan menyesuaikan dengan isi (`scrollHeight`)
 * - Cocok untuk UX yang smooth seperti Twitter, WhatsApp, dsb.
 */
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