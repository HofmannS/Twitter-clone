'use client';

import { useMemo } from 'react';
import twemoji from 'twemoji';

export default function TwemojiText({ text, className = '', inline = false }) {
  const html = useMemo(() => {
    if (!text) return '';
    return twemoji.parse(text, {
      folder: 'svg',
      ext: '.svg',
    });
  }, [text]);

  if (!text) return null;

  const Tag = inline ? 'span' : 'div';

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
