export interface GemaType {
    id: string;
    content: string;
    createdAt: string;
    author: {
        firstname: string;
        lastname: string;
        username: string;
        image?: string;
    };
    media?: {
        type: 'image' | 'video';
        url: string;
    }[];
    viewsCount: number;
    likesCount: number;
    repliesCount: number;
}
