'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather } from '@fortawesome/free-solid-svg-icons';
import api from '@/services/api';
import { useState } from 'react';

export default function MainFeed() {
    const [createGemaField, setCreateGemaField] = useState('');

    const handlePost = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
            console.log('msk');
            const data = {
                content: createGemaField,
            };
            console.log(data);
            const res = api.post('/gema', data, { withCredentials: true });
            console.log('Res Create Gema: ', res);
        } catch (error: unknown) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="border-b border-base-300 pb-4">
                <div className="flex items-center space-x-2 mb-4">
                    <FontAwesomeIcon icon={faFeather} className="h-5 w-5 opacity-50" />
                    <input
                        type="text"
                        placeholder="What is going on?"
                        className="input input-bordered w-full"
                        value={createGemaField}
                        onChange={(e) => setCreateGemaField(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={handlePost}>
                    Post
                </button>
            </div>

            <div className="mt-6 space-y-4">
                {[1, 2, 3].map((post) => (
                    <div key={post} className="card bg-base-100 shadow p-4 space-y-2">
                        <div className="flex items-center space-x-3">
                            <div className="avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTBA57d__PXonmFyFDla6f2WRtfPvP9an3YA&s"
                                        alt="img"
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold">Uiiia Uiiaa</p>
                                <p className="text-xs text-gray-500">@uuiiauiiai</p>
                            </div>
                        </div>
                        <p>Kucing sebelah tidak friendly</p>
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTBA57d__PXonmFyFDla6f2WRtfPvP9an3YA&s"
                            alt="Post content image"
                            className="rounded-xl"
                        />
                    </div>
                ))}
            </div>
        </>
    );
}
