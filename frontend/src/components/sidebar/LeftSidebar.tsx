import SidebarLogo from "./LeftSidebarLogo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faEnvelope, faHome, faHashtag, faUsers, faEllipsisH, faFeather, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar() {
return (
    <aside className="w-20 lg:w-1/5 flex flex-col justify-between p-2 lg:p-4 bg-base-100 border-r border-base-200">
    <div className="space-y-4 flex flex-col items-center lg:items-start">
        <SidebarLogo />
        <nav className="space-y-4 w-full">
        {[
            { icon: faHome, label: "Home" },
            { icon: faSearch, label: "Explore" },
            { icon: faBell, label: "Notifications" },
            { icon: faEnvelope, label: "Messages" },
            { icon: faUsers, label: "Communities" },
            { icon: faHashtag, label: "Trending" },
            { icon: faEllipsisH, label: "More" },
        ].map((item, idx) => (
            <button key={idx} className="btn btn-ghost w-full flex justify-center lg:justify-start">
            <FontAwesomeIcon icon={item.icon} className="h-5 w-5 opacity-50 mr-0 lg:mr-2" />
            <span className="hidden lg:inline">{item.label}</span>
            </button>
        ))}
        </nav>
        <button className="btn btn-primary w-full flex justify-center lg:justify-center">
        <FontAwesomeIcon icon={faFeather} className="h-5 w-5 opacity-50 mr-0 lg:mr-2" />
        <span className="hidden lg:inline">Post</span>
        </button>
    </div>
    <div className="flex flex-col items-center lg:items-start space-x-0 space-y-1 mt-6">
        <div className="avatar">
        <div className="w-10 rounded-full">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTBA57d__PXonmFyFDla6f2WRtfPvP9an3YA&s" alt="User avatar" />
        </div>
        </div>
        <div className="hidden lg:block">
        <p className="font-semibold">Felix Prima</p>
        <p className="text-xs text-gray-500">@fx.prima</p>
        </div>
    </div>
    </aside>
);
}
