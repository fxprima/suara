export interface UserPublicProfile {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    avatar?: string;
    biography?: string;
    website?: string;
    location?: string;
    dob?: Date;
    banner?: string;
    createdAt: Date;
    followersCount: number;
    followingCount: number;
    
}
export interface GemaType {
    id: string;
    author: UserPublicProfile;
    content: string;
    parentId: string | null;
    createdAt: string;
    media?: {
        type: 'image' | 'video';
        url: string;
    }[];
    viewsCount: number;
    likedBy : {user: UserPublicProfile}[];
    likesCount?: number;
    repliesCount: number;
}

export interface GemaTypeDetail extends GemaType {
    replies: GemaType[];
}

export interface ReplyType extends GemaType{
    id: string;
    replies?: ReplyType[]; 
}