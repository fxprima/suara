export type NotificationType =
    | 'follow_request'
    | 'follow'
    | 'mention'
    | 'reply'
    | 'repost'
    | 'like'
    | 'system';

export type NotificationItem = {
    id: string;
    type: NotificationType;
    actor?: {
        name: string;
        username: string;
        avatar?: string | null;
    };
    createdAtText: string; 
    isRead?: boolean;
    title: string; 
    subtitle?: string; 
    meta?: {
        postSnippet?: string;
        fileName?: string;
    };
};
