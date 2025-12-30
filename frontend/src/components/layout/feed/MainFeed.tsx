'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather } from '@fortawesome/free-solid-svg-icons';
import api from '@/services/api';
import { useRef, useState } from 'react';
import { useAutoGrow } from '@/hooks/ui/useAutoGrow';
import { extractErrorMessage } from '@/utils/handleApiError';
import { ToastMessage } from '../../common/toast/ToastMessage';
import { useToast } from '@/hooks/ui/useToast';
import MediaPicker from '@/components/common/media/MediaPicker';
import useAuth from '@/hooks/auth/useAuth';
import GemaFeed from '../../gema/GemaFeed';

const FEED_LIMIT = 10;

export default function MainFeed() {
  const { user } = useAuth();
  const { toasts, showToast } = useToast();

  const [createGemaField, setCreateGemaField] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState({ createGema: false });

  const textareaRef = useAutoGrow(createGemaField);

  const [reloadToken, setReloadToken] = useState(0);

  const clearMedia = () => setSelectedFiles([]);

  const handlePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!user?.id) {
      showToast('Kamu belum login.', 'error');
      return;
    }

    if (!createGemaField.trim() && !selectedFiles.length) return;

    try {
      setLoading((p) => ({ ...p, createGema: true }));

      const formData = new FormData();
      formData.append('content', createGemaField);
      selectedFiles.forEach((file) => formData.append('media', file));

      await api.post('/gema', formData, { withCredentials: true });

      setCreateGemaField('');
      clearMedia();
      showToast('You have successfully gema-ed your Suara!', 'success');

      setReloadToken((x) => x + 1);
    } catch (err) {
      console.error(err);
      showToast(extractErrorMessage(err), 'error');
    } finally {
      setLoading((p) => ({ ...p, createGema: false }));
    }
  };

  return (
    <>
      <ToastMessage toasts={toasts} />

      <div className="border-b border-base-300 pb-4">
        <div className="flex items-start space-x-2 mb-4">
          <FontAwesomeIcon
            icon={faFeather}
            className="h-5 w-5 opacity-50 translate-y-[2px]"
          />

          <div className="w-full">
            <textarea
              ref={textareaRef}
              placeholder="What is going on?"
              className="textarea textarea-bordered w-full resize-none min-h-0 overflow-hidden py-2 leading-snug"
              rows={1}
              value={createGemaField}
              onChange={(e) => setCreateGemaField(e.target.value)}
            />

            <MediaPicker
              files={selectedFiles}
              onChange={setSelectedFiles}
              max={4}
              showToast={showToast}
              className="w-full"
            />
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handlePost}
          disabled={loading.createGema || !user?.id}
        >
          {loading.createGema && <span className="loading loading-spinner loading-sm" />}
          {loading.createGema ? 'Menggema...' : 'Gema'}
        </button>
      </div>

      <GemaFeed
        endpoint={user?.id ? `/gema/${user.id}/feed` : ''}
        limit={FEED_LIMIT}
        enabled={Boolean(user?.id)}
        reloadToken={reloadToken}
        emptyText="Gema? Gema? …Anyone? Start one!"
      />
    </>
  );
}
