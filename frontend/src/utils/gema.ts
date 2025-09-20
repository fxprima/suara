// Fungsi untuk mengetahui apakah gema disukai atau tidak

import { GemaType } from "../../types/gema";

const isGemaLikedByUser = (gema: GemaType, userId: String): boolean => {
    if (!gema || !userId) return false;
    return gema.likedBy.some((u) => u.user.id === userId);
}

export default isGemaLikedByUser;