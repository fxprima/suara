import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getNotifSocket() {
    if (socket) return socket;

    const baseUrl =
        process.env.NEXT_PUBLIC_WS_URL ||
        (typeof window !== 'undefined' ? window.location.origin : 'http://localhost');

    socket = io(`${baseUrl}/notifications`, {
        autoConnect: false,
        transports: ['websocket'],
        auth: {
            token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
        },
        withCredentials: true,
    });

    return socket;
}
