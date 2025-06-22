'use client'
import LeftSidebar from "@/components/layout/sidebar/LeftSidebar";
import RightSidebar from "@/components/layout/sidebar/RightSidebar";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Profile() {
    const setProfilePicture = () => {
        console.log('nanti dulu')
    }
    const setProfile = () => {

    }

    return (
        <div className="flex h-screen w-screen">
            <LeftSidebar />
            <div className="flex flex-col w-screen items-center p-4 bg-base-200">
                <div className="flex flex-col w-2/5 gap-6">
                    <div className="avatar flex justify-items-center">
                        <div className="w-24 rounded-full z-0">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTBA57d__PXonmFyFDla6f2WRtfPvP9an3YA&s" alt="User avatar" />
                        </div>
                        <div className="items-center p-4 z-10 absolute opacity-0 transition-opacity cursor-pointer hover:opacity-80" onClick={setProfilePicture}>
                            <FontAwesomeIcon icon={faCamera} size="2x" className="p-4 text-primary text-white" />
                        </div>
                    </div>
                    <p className="font-bold text-lg">Edit Profile</p>
                    <form className="flex flex-col items-center gap-4" action="">
                        <input type="text" name="name" placeholder="Name" className="input w-full" />
                        <textarea name="bio" className="textarea w-full" placeholder="Bio"></textarea>
                        <input type="text" name="location" placeholder="location" className="input w-full" />
                        <input type="text" name="website" placeholder="website" className="input w-full" />
                        <div className="flex justify-end w-full">
                            <button className="btn" onClick={setProfile}>Save</button>
                        </div>
                    </form>  
                </div>
            </div>
            <RightSidebar />
        </div>
    )
}