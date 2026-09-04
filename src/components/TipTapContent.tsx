import React from 'react';
import 'highlight.js/styles/atom-one-dark.css';

interface TipTapContentProps {
  content?: string;
  className?: string;
}

const TipTapContent: React.FC<TipTapContentProps> = ({ content, className = "" }) => {
  if (!content) return null;

  return (
    <div 
      className={`tiptap-prose ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default TipTapContent;
