'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBell,
    faEnvelope,
    faHome,
    faHashtag,
    faUsers,
    faEllipsisH,
    faFeather,
    faSearch,
    faSignOutAlt,
    faUser,
    faCog,
} from '@fortawesome/free-solid-svg-icons';
import SidebarLogo from './LeftSidebarLogo';
import useAuth from '@/hooks/auth/useAuth';
import Link from 'next/link';
import { useFetchData } from '@/hooks/data/useFetchData';
import { UserPublicProfile } from '../../../../types/gema';

export default function LeftSidebar() {
    const { user, logout } = useAuth();

    const { data: userPublicData, loading: userProfile } = useFetchData<UserPublicProfile>(
        `user/profile/${user?.username}`
    );

    return (
        <aside className="w-20 lg:w-1/5 flex flex-col justify-between p-2 lg:p-4 bg-base-200 border-r border-base-200">
            <div className="space-y-4 flex flex-col items-center lg:items-start">
                <SidebarLogo />
                <nav className="space-y-4 w-full">
                    {[
                        { icon: faHome, label: 'Home', link: '/dashboard' },
                        { icon: faSearch, label: 'Explore' },
                        { icon: faBell, label: 'Notifications' },
                        { icon: faEnvelope, label: 'Messages' },
                        { icon: faUsers, label: 'Communities' },
                        { icon: faHashtag, label: 'Trending' },
                        { icon: faEllipsisH, label: 'More' },
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => (window.location.href = item.link || '/')}
                            className="btn btn-ghost w-full flex justify-center lg:justify-start"
                        >
                            <FontAwesomeIcon
                                icon={item.icon}
                                className="h-5 w-5 opacity-50 mr-0 lg:mr-2"
                            />
                            <span className="hidden lg:inline">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <button className="btn btn-primary w-full flex justify-center lg:justify-center">
                    <FontAwesomeIcon icon={faFeather} className="h-5 w-5 opacity-50 mr-0 lg:mr-2" />
                    <span className="hidden lg:inline">Post</span>
                </button>
            </div>

            <div className="relative flex flex-col items-center lg:items-start space-x-0 space-y-1 mt-6">
                <div className="dropdown dropdown-top">
                    <label tabIndex={0} className="avatar cursor-pointer">
                        <div className="w-10 rounded-full">
                            <img src={`${userPublicData?.avatar}`} alt="User avatar" />
                        </div>
                    </label>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow rounded-box w-40 bg-base-300"
                    >
                        <li>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                                <Link href="/profile" className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                                    Profile
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faCog} className="h-4 w-4" />
                                <Link href="/settings" className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCog} className="h-4 w-4" />
                                    Settings
                                </Link>
                            </div>
                        </li>
                        <li>
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 text-red-500"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="hidden lg:block">
                    <p className="font-semibold">
                        {user ? `${user.firstname} ${user.lastname}` : 'Guest'}
                    </p>
                    <p className="text-xs text-gray-500">@{user?.username || 'anonymous'}</p>
                </div>
            </div>
        </aside>
    );
}
