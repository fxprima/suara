import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faEnvelope, faHome, faHashtag, faUsers, faEllipsisH, faFeather, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
return (
    <div className="flex h-screen">
    {/* Sidebar */}
    <aside className="w-20 lg:w-1/5 flex flex-col justify-between p-2 lg:p-4 bg-base-100 border-r border-base-200">
        <div className="space-y-4 flex flex-col items-center lg:items-start">
        <div className="flex items-center justify-center lg:justify-between w-full">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Suara Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-primary hidden lg:block">Suara</h1>
          </div>
        </div>
        <nav className="space-y-4 w-full">
            <button className="btn btn-ghost w-full flex justify-center lg:justify-start"><FontAwesomeIcon icon={faHome} className="h-5 w-5 opacity-50 mr-0 lg:mr-2" /> <span className="hidden lg:inline">Home</span></button>
            <button className="btn btn-ghost w-full flex justify-center lg:justify-start"><FontAwesomeIcon icon={faSearch} className="h-5 w-5 opacity-50 mr-0 lg:mr-2" /> <span className="hidden lg:inline">Explore</span></button>
            <button className="btn btn-ghost w-full flex justify-center lg:justify-start"><FontAwesomeIcon icon={faBell} className="h-5 w-5 opacity-50 mr-0 lg:mr-2" /> <span className="hidden lg:inline">Notifications</span></button>
            <button className="btn btn-ghost w-full flex justify-center lg:justify-start"><FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 opacity-50 mr-0 lg:mr-2" /> <span className="hidden lg:inline">Messages</span></button>
            <button className="btn btn-ghost w-full flex justify-center lg:justify-start"><FontAwesomeIcon icon={faUsers} className="h-5 w-5 opacity-50 mr-0 lg:mr-2" /> <span className="hidden lg:inline">Communities</span></button>
            <button className="btn btn-ghost w-full flex justify-center lg:justify-start"><FontAwesomeIcon icon={faHashtag} className="h-5 w-5 opacity-50 mr-0 lg:mr-2" /> <span className="hidden lg:inline">Trending</span></button>
            <button className="btn btn-ghost w-full flex justify-center lg:justify-start"><FontAwesomeIcon icon={faEllipsisH} className="h-5 w-5 opacity-50 mr-0 lg:mr-2" /> <span className="hidden lg:inline">More</span></button>
        </nav>
        <button className="btn btn-primary w-full flex justify-center lg:justify-center"><FontAwesomeIcon icon={faFeather} className="h-5 w-5 opacity-50 mr-0 lg:mr-2" /> <span className="hidden lg:inline">Post</span></button>
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

    {/* Main Feed */}
    <main className="flex-1 p-4 bg-base-200 overflow-y-scroll">
        <div className="border-b border-base-300 pb-4">
        <div className="flex items-center space-x-2 mb-4">
            <FontAwesomeIcon icon={faFeather} className="h-5 w-5 opacity-50" />
            <input type="text" placeholder="Apa yang sedang terjadi?" className="input input-bordered w-full" />
        </div>
        <button className="btn btn-primary">Post</button>
        </div>

        <div className="mt-6 space-y-4">
        {[1, 2, 3].map((post) => (
            <div key={post} className="card bg-base-100 shadow p-4 space-y-2">
            <div className="flex items-center space-x-3">
                <div className="avatar">
                <div className="w-10 rounded-full">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTBA57d__PXonmFyFDla6f2WRtfPvP9an3YA&s" alt="img" />
                </div>
                </div>
                <div>
                <p className="font-semibold">Kegblosigan.Unfaedah</p>
                <p className="text-xs text-gray-500">@kegblosigan</p>
                </div>
            </div>
            <p>Guys plis kalo denger sirine ambulance tuh kalian menepi yaaa tolong hihi 😭😭</p>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTBA57d__PXonmFyFDla6f2WRtfPvP9an3YA&s" alt="Post content image" className="rounded-xl" />
            </div>
        ))}
        </div>
    </main>

    {/* Right Sidebar */}
    <aside className="hidden lg:block w-1/4 p-4 border-l border-base-200 bg-base-100">
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
    </div>
);
}
