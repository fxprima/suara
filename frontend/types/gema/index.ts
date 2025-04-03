export interface GemaType {
    id: string;
    content: string;
    createdAt: string;
    author: {
        firstname: string;
        lastname: string;
        username: string;
        avatar?: string;
    };
    media?: {
        type: 'image' | 'video';
        url: string;
    }[];
    viewsCount: number;
    likesCount: number;
    repliesCount: number;
}

export interface GemaTypeDetail extends GemaType {
    replies: {
        id: string;
        content: string;
        createdAt: string;
        author: {
            firstname: string;
            lastname: string;
            username: string;
            avatar?: string;
        };
    }[];
}


export interface ReplyType {
    id: string;
    author: {
        firstname: string;
        lastname: string;
        username: string;
        avatar?: string;
    };
    content: string;
    createdAt: string;
    replies?: ReplyType[]; // pastikan field "replies" ada di API
}