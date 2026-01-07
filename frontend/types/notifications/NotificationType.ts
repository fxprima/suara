export type NotificationType =
    | 'FOLLOW'
    | 'MENTION'
    | 'REPLY'
    | 'REPOST'
    | 'LIKE'
    | 'FOLLOW_REQUEST'
    | 'SYSTEM';

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
    message: string; 
    meta?: {
        postSnippet?: string;
        media?: string;
        fileName?: string;
        subMessage?: string; 
    };
};

export type NotificationResponse = {
  data: NotificationItem[],
  nextCursor: string,
  hasNext: string
}
