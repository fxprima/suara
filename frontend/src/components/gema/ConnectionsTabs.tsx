"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ConnectionsTabs({ username }: { username: string }) {
  const pathname = usePathname();

  const isFollowers = pathname.endsWith("/followers");
  const isFollowings = pathname.endsWith("/followings");

  return (
    <div className="flex border-b border-base-300">
      <Link
        href={`/profile/${username}/followers`}
        className={`flex-1 text-center py-3 font-medium ${
          isFollowers ? "border-b-2 border-primary" : "opacity-60"
        }`}
      >
        Followers
      </Link>

      <Link
        href={`/profile/${username}/followings`}
        className={`flex-1 text-center py-3 font-medium ${
          isFollowings ? "border-b-2 border-primary" : "opacity-60"
        }`}
      >
        Following
      </Link>
    </div>
  );
}
