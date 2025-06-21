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
    replies: GemaType[];
}

export interface ReplyType extends GemaType{
    id: string;
    replies?: ReplyType[]; 
}