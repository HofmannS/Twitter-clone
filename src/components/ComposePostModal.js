'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TextInputWithEmoji from '@/src/components/TextInputWithEmoji';

export default function ComposePostModal({ open, onClose, user, onPost, posting }) {
  const [draft, setDraft] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setDraft('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handleEscape(e) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  async function handlePost() {
    if (!draft.trim() || posting) return;
    await onPost(draft.trim());
    setDraft('');
  }

  function handleClose() {
    setDraft('');
    onClose();
  }

  if (!mounted || !open || !user) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-0 sm:p-4"
      onClick={handleClose}
    >
      <div
        className="w-full h-full sm:h-auto sm:max-w-lg bg-black sm:rounded-2xl sm:border border-zinc-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end p-4 border-b border-zinc-800 sm:border-b-0">
          <button
            type="button"
            onClick={handleClose}
            className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="flex-1 flex flex-col px-4 pb-4 sm:pb-6 overflow-y-auto">
          <div className="flex gap-3 mb-4">
            <img
              src={user.avatar ?? '/avatars/default_avatar.png'}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <span className="font-semibold text-zinc-300 pt-2">
              @{user.username}
            </span>
          </div>

          <TextInputWithEmoji
            multiline
            rows={4}
            autoFocus
            value={draft}
            onChange={setDraft}
            placeholder="What's happening?"
            className="flex-1"
            actions={
              <button
                type="button"
                onClick={handlePost}
                disabled={posting || !draft.trim()}
                className="bg-yellow-400 text-black px-5 py-2 rounded-full font-bold hover:bg-yellow-300 disabled:opacity-50 transition-colors"
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
            }
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
