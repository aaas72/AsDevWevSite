import React from 'react';
import 'highlight.js/styles/atom-one-dark.css';

interface TipTapContentProps {
  content: string;
}

const TipTapContent: React.FC<TipTapContentProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div 
      className="tiptap-prose"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default TipTapContent;
