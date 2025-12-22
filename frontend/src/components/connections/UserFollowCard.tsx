
import Image from "next/image";
import Link from "next/link";

type UserFollowCardProps = {
    id: string;
    username: string;
    firstname: string;
    lastname?: string;
    bio?: string;
    avatar?: string;
    isFollowing?: boolean;
    onPage?: string;
};

export default function UserFollowCard({
    id,
    username,
    firstname,
    lastname,
    bio,
    avatar,
    onPage = 'following',
    isFollowing = true,
}: UserFollowCardProps) {


    return (
        <div className="flex items-start justify-between gap-4 p-4 border-b border-base-300">

            <Link href={`/profile/${username}`} className="shrink-0">
                <img
                    src={avatar ?? '/default-avatar.svg'}
                    alt={firstname}
                    width={48}
                    height={48}
                    className="rounded-full"
                />
            </Link>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <Link
                        href={`/profile/${username}`}
                        className="font-semibold hover:underline truncate"
                    >
                        {`${firstname} ${lastname}`}
                    </Link>
                    <span className="text-sm opacity-60 truncate">
                        @{username}
                    </span>
                </div>

                {bio && (
                    <p className="text-sm opacity-80 mt-1 line-clamp-2">
                        {bio}
                    </p>
                )}
            </div>

            <button
                className={`btn btn-sm rounded-full ${isFollowing ? "btn-outline" : "btn-primary"}`}
            >
                {isFollowing ? "Following" : 
                    onPage === 'followings' ? 'Follow' : 'Follow back'
                }
            </button>

        </div>
    );
}
