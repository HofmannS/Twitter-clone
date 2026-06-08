'use client';

import EmojiPicker, { Theme, EmojiStyle, Categories } from 'emoji-picker-react';
import en from 'emoji-picker-react/dist/data/emojis-en.js';

const SMARTPHONE_CATEGORIES = [
  { category: Categories.SUGGESTED, name: 'Recent' },
  { category: Categories.SMILEYS_PEOPLE, name: 'Smileys & People' },
  { category: Categories.ANIMALS_NATURE, name: 'Animals & Nature' },
  { category: Categories.FOOD_DRINK, name: 'Food & Drink' },
  { category: Categories.TRAVEL_PLACES, name: 'Travel & Places' },
  { category: Categories.ACTIVITIES, name: 'Activities' },
  { category: Categories.OBJECTS, name: 'Objects' },
  { category: Categories.SYMBOLS, name: 'Symbols' },
];

export default function Picker({ onEmojiClick }) {
  return (
    <EmojiPicker
      theme={Theme.DARK}
      emojiStyle={EmojiStyle.APPLE}
      emojiData={en}
      categories={SMARTPHONE_CATEGORIES}
      width={320}
      height={380}
      searchDisabled={false}
      previewConfig={{ showPreview: true }}
      onEmojiClick={(emojiData) => onEmojiClick(emojiData.emoji)}
    />
  );
}
