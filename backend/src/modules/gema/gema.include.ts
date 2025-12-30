export const GEMAS_INCLUDE = {
    author: { select: { id: true, firstname: true, lastname: true, username: true, avatar: true } },
    likedBy: { select: { user: { select: { id: true, avatar: true, firstname: true, lastname: true, username: true } } } },
} as const;
