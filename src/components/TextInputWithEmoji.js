'use client';

import { useEffect, useRef, useState } from 'react';
import Picker from '@/src/components/EmojiPicker';

function insertAtCursor(ref, value, emoji, onChange) {
  const el = ref.current;
  const start = el?.selectionStart ?? value.length;
  const end = el?.selectionEnd ?? value.length;
  const next = value.slice(0, start) + emoji + value.slice(end);
  onChange(next);
  requestAnimationFrame(() => {
    el?.focus();
    const pos = start + emoji.length;
    el?.setSelectionRange(pos, pos);
  });
}

function EmojiButton({ onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-zinc-500 hover:text-yellow-400 transition-colors p-1 rounded-full hover:bg-zinc-800"
      aria-label="Add emoji"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    </button>
  );
}

export default function TextInputWithEmoji({
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 2,
  className = '',
  onKeyDown,
  actions,
  autoFocus = false,
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && multiline && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus, multiline]);

  useEffect(() => {
    if (!pickerOpen) return;

    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setPickerOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [pickerOpen]);

  function handleEmojiClick(emoji) {
    insertAtCursor(inputRef, value, emoji, onChange);
  }

  const inputClassName = multiline
    ? 'w-full bg-black outline-none resize-none text-lg placeholder-zinc-600'
    : 'flex-1 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-yellow-400 transition-colors';

  if (multiline) {
    return (
      <div ref={containerRef} className={className}>
        <textarea
          ref={inputRef}
          className={inputClassName}
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="flex justify-between items-center mt-2">
          <div className="relative">
            <EmojiButton onToggle={() => setPickerOpen((v) => !v)} />
            {pickerOpen && (
              <div className="absolute bottom-full left-0 mb-2 z-50">
                <Picker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
          {actions}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`flex gap-2 items-center ${className}`}>
      <div className="relative shrink-0">
        <EmojiButton onToggle={() => setPickerOpen((v) => !v)} />
        {pickerOpen && (
          <div className="absolute bottom-full left-0 mb-2 z-50">
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        className={inputClassName}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
