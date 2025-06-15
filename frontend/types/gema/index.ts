export interface UserPublicProfile {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    avatar?: string;
}
export interface GemaType {
    id: string;
    content: string;
    createdAt: string;
    author: UserPublicProfile;
    media?: {
        type: 'image' | 'video';
        url: string;
    }[];
    viewsCount: number;
    likedBy : {user: UserPublicProfile}[];
    repliesCount: number;
}

export interface GemaTypeDetail extends GemaType {
    replies: {
        id: string;
        content: string;
        createdAt: string;
        author: UserPublicProfile;
        likedBy : {user: UserPublicProfile}[];
    }[];
}

export interface ReplyType {
    id: string;
    author: UserPublicProfile;
    content: string;
    createdAt: string;
    replies?: ReplyType[]; 
}