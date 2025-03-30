import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function RightSidebar() {
return (
    <aside className="hidden lg:block w-1/4 p-4 border-l border-base-200 bg-base-200">
    <div className="flex items-center space-x-2 mb-4">
        <FontAwesomeIcon icon={faSearch} className="h-5 w-5 opacity-50" />
        <input type="text" placeholder="Search Suara" className="input input-bordered w-full" />
    </div>
    <div className="card bg-base-100 shadow p-4 mb-4">
        <h2 className="font-semibold mb-2">Subscribe to Premium</h2>
        <p className="text-sm mb-2">Unlock new features and tools!</p>
        <button className="btn btn-primary w-full">Subscribe</button>
    </div>

    <div className="card bg-base-100 shadow p-4 mb-4">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <h2 className="font-semibold mb-2">What's happening</h2>
        <ul className="text-sm space-y-2">
        <li># Drs. Mashudi</li>
        <li># Nabrak Genk</li>
        <li># Jungkook</li>
        </ul>
    </div>

    <div className="card bg-base-100 shadow p-4">
        <h2 className="font-semibold mb-2">Who to follow</h2>
        <ul className="text-sm space-y-2">
        <li>@TangerangNet</li>
        <li>@BMKGIndonesia</li>
        </ul>
    </div>
    </aside>
);
}
