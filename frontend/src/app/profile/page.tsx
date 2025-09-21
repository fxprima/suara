'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather, faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import api from '@/services/api';
import { useState, useRef } from 'react';
import { useAutoGrow } from '@/hooks/ui/useAutoGrow';
import { extractErrorMessage } from '@/utils/handleApiError';
import { useFetchData } from '@/hooks/data/useFetchData';
import { handleReply } from '@/utils/handleReply';
import { useSilentRefetch } from '@/hooks/data/useSilentRefetch';
import MediaPicker from '@/components/common/media/MediaPicker';
import MyProfilePage from '@/components/layout/profile/Profile';

export default function MyProfile() {
    return <MyProfilePage />;
}
