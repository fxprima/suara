'use client';

import LeftSidebar from '@/components/layout/sidebar/LeftSidebar';
import RightSidebar from '@/components/layout/sidebar/RightSidebar';
import { useFetchData } from '@/hooks/data/useFetchData';
import useAuth from '@/hooks/auth/useAuth';
import { UserPublicProfile } from '../../../../types/gema';

import { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faAt,
    faCamera,
    faGlobe,
    faLocationDot,
    faPen,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import api from '@/services/api';
import { useToast } from '@/hooks/ui/useToast';
import { ToastMessage } from '@/components/common/toast/ToastMessage';
import { extractErrorMessage } from '@/utils/handleApiError';

/* ---------- Field with Icon ---------- */
type FieldProps = {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    icon: IconDefinition;
    type?: 'text' | 'url';
    multiline?: boolean;
    rows?: number;
    autoComplete?: string;
};

function Field({
    label,
    name,
    value,
    onChange,
    placeholder,
    icon,
    type = 'text',
    multiline = false,
    rows = 3,
    autoComplete,
}: FieldProps) {
    return (
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text">{label}</span>
            </label>

            <div className="relative">
                <FontAwesomeIcon
                    icon={icon}
                    className={[
                        'absolute left-3 z-10 opacity-70',
                        multiline ? 'top-3' : 'top-1/2 -translate-y-1/2',
                    ].join(' ')}
                />

                {multiline ? (
                    <textarea
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        rows={rows}
                        autoComplete={autoComplete}
                        className="textarea w-full pl-10 rounded-xl
                       bg-base-300 border border-base-content/20
                       focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
                    />
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        className="input w-full pl-10 rounded-xl
                       bg-base-300 border border-base-content/20
                       focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40"
                    />
                )}
            </div>
        </div>
    );
}

/* ---------- Skeleton ---------- */
function FormSkeleton() {
    return (
        <div className="rounded-2xl bg-base-200 border border-base-content/10 shadow-md">
            <div className="p-6 space-y-3">
                <div className="flex items-center gap-4">
                    <div className="skeleton h-24 w-24 rounded-full" />
                    <div className="skeleton h-8 w-40" />
                </div>
                <div className="skeleton h-10 w-full mt-4" />
                <div className="skeleton h-10 w-full" />
                <div className="skeleton h-10 w-full" />
                <div className="skeleton h-24 w-full" />
                <div className="skeleton h-10 w-full" />
                <div className="skeleton h-10 w-full" />
                <div className="flex justify-end">
                    <div className="skeleton h-10 w-28" />
                </div>
            </div>
        </div>
    );
}

/* ---------- Page ---------- */
export default function Profile() {
    const { user } = useAuth();
    const username = user?.username || '';

    const { data: profile, loading: loadingFetchProfile } = useFetchData<UserPublicProfile>(
        `user/profile/${username}`
    );

    const { toasts, showToast } = useToast();

    const [formData, setFormData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        biography: '',
        location: '',
        website: '',
    });
    const [initialData, setInitialData] = useState<typeof formData | null>(null);

    useEffect(() => {
        if (profile) {
            const filled = {
                username: profile.username || '',
                firstname: profile.firstname || '',
                lastname: profile.lastname || '',
                biography: profile.biography || '',
                location: profile.location || '',
                website: profile.website || '',
            };
            setFormData(filled);
            setInitialData(filled);
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const isDirty = useMemo(() => {
        if (!initialData) return false;
        return JSON.stringify(formData) !== JSON.stringify(initialData);
    }, [formData, initialData]);

    const setProfilePicture = () => {
        console.log('Upload profile picture clicked');
    };

    const setProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isDirty) return;
        console.log('Form submitted:', formData);

        try {
            const res = await api.patch(`/user/${user?.id}`, formData, { withCredentials: true });
            console.log('Res Update Profile:', res);

            showToast('You successfully edited your profile', 'success');
        } catch (error) {
            console.error(error);
            showToast(extractErrorMessage(error), 'error');
        } finally {
            setInitialData(formData);
        }
    };

    return (
        <div className="flex h-screen w-screen">
            <ToastMessage toasts={toasts} />
            {/* sidebar kiri */}
            <LeftSidebar />

            {/* kolom tengah — samain background dengan sidebar */}
            <main className="flex-1 overflow-auto bg-base-200">
                <div className="mx-auto max-w-2xl px-4 py-6">
                    {/* Header avatar + title */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative group">
                            <img
                                src={
                                    (profile as any)?.avatar ||
                                    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTBA57d__PXonmFyFDla6f2WRtfPvP9an3YA&s'
                                }
                                alt="User avatar"
                                className="w-24 h-24 rounded-full object-cover"
                            />
                            <button
                                onClick={setProfilePicture}
                                className="absolute inset-0 flex items-center justify-center rounded-full
                           bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Change profile picture"
                            >
                                <FontAwesomeIcon icon={faCamera} className="text-white" />
                            </button>
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold">Edit Profile</h1>
                        </div>
                    </div>

                    {/* Panel form — bg disamain ke base-200 biar nyatu dengan sidebar */}
                    {loadingFetchProfile ? (
                        <FormSkeleton />
                    ) : (
                        <div className="rounded-2xl bg-base-200 border border-base-content/10 shadow-md">
                            <div className="p-6">
                                <form className="flex flex-col gap-4" onSubmit={setProfile}>
                                    <Field
                                        label="Username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="yourhandle"
                                        icon={faAt}
                                        autoComplete="username"
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Field
                                            label="First Name"
                                            name="firstname"
                                            value={formData.firstname}
                                            onChange={handleChange}
                                            placeholder="John"
                                            icon={faUser}
                                            autoComplete="given-name"
                                        />
                                        <Field
                                            label="Last Name"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            icon={faUser}
                                            autoComplete="family-name"
                                        />
                                    </div>

                                    <Field
                                        label="Bio"
                                        name="biography"
                                        value={formData.biography}
                                        onChange={handleChange}
                                        placeholder="Tell us about yourself"
                                        icon={faPen}
                                        multiline
                                        rows={4}
                                    />

                                    <Field
                                        label="Location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Jakarta, ID"
                                        icon={faLocationDot}
                                        autoComplete="address-level2"
                                    />

                                    <Field
                                        label="Website"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        placeholder="https://example.com"
                                        icon={faGlobe}
                                        type="url"
                                        autoComplete="url"
                                    />

                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            className="btn btn-ghost"
                                            onClick={() => initialData && setFormData(initialData)}
                                            disabled={!isDirty}
                                        >
                                            Reset
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={!isDirty}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* sidebar kanan */}
            <RightSidebar />
        </div>
    );
}
