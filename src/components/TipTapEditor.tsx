import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Placeholder } from '@tiptap/extension-placeholder';
import { common, createLowlight } from 'lowlight';
import 'highlight.js/styles/atom-one-dark.css'; // Add syntax highlighting theme
import { 
  FiBold, FiItalic, FiUnderline, 
  FiList, FiAlignLeft, FiAlignCenter, FiAlignRight, 
  FiLink, FiImage, FiCode 
} from 'react-icons/fi';
import { FaStrikethrough, FaQuoteRight } from 'react-icons/fa';
import { MdOutlineFormatListNumbered } from 'react-icons/md';
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";

const lowlight = createLowlight(common);

interface TipTapEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
}

const MenuBar = ({ editor, onImageUpload }: { editor: any, onImageUpload?: (file: File) => Promise<string> }) => {
  if (!editor) {
    return null;
  }

  const addImage = async () => {
    if (!onImageUpload) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const url = await onImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
          console.error("Image upload failed", error);
        }
      }
    };
    input.click();
  };

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) {
      return
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const btnClass = "p-2.5 rounded-lg hover:bg-white/10 text-[#919191] hover:text-white transition-colors flex items-center justify-center";
  const activeClass = "p-2.5 rounded-lg bg-white/15 text-white transition-colors flex items-center justify-center shadow-inner";

  return (
    <div className="flex flex-wrap gap-1 p-3 bg-[#141414] border-b border-white/10 sticky top-0 z-10">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? activeClass : btnClass} title="Bold"><FiBold /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? activeClass : btnClass} title="Italic"><FiItalic /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? activeClass : btnClass} title="Underline"><FiUnderline /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? activeClass : btnClass} title="Strike"><FaStrikethrough /></button>
      
      <div className="w-px h-6 bg-white/10 mx-2 my-auto"></div>
      
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? activeClass : btnClass} title="H1"><LuHeading1 /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? activeClass : btnClass} title="H2"><LuHeading2 /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? activeClass : btnClass} title="H3"><LuHeading3 /></button>
      
      <div className="w-px h-6 bg-white/10 mx-2 my-auto"></div>
      
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? activeClass : btnClass} title="Bullet List"><FiList /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? activeClass : btnClass} title="Ordered List"><MdOutlineFormatListNumbered /></button>
      
      <div className="w-px h-6 bg-white/10 mx-2 my-auto"></div>
      
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? activeClass : btnClass} title="Align Left"><FiAlignLeft /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? activeClass : btnClass} title="Align Center"><FiAlignCenter /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? activeClass : btnClass} title="Align Right"><FiAlignRight /></button>
      
      <div className="w-px h-6 bg-white/10 mx-2 my-auto"></div>

      <button type="button" onClick={setLink} className={editor.isActive('link') ? activeClass : btnClass} title="Link"><FiLink /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? activeClass : btnClass} title="Quote"><FaQuoteRight /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? activeClass : btnClass} title="Code Block"><FiCode /></button>
      {onImageUpload && (
        <button type="button" onClick={addImage} className={btnClass} title="Image"><FiImage /></button>
      )}
      <button type="button" onClick={addTable} className={btnClass} title="Table">
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
      </button>
    </div>
  );
};

const TipTapEditor: React.FC<TipTapEditorProps> = ({ value, onChange, placeholder, onImageUpload }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // disable default codeBlock to use Lowlight
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder: placeholder || "Write something...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-prose focus:outline-none min-h-[400px] p-8',
      },
    },
  });

  return (
    <div className="border border-white/10 rounded-[1.25rem] overflow-hidden bg-[rgba(255,255,255,0.02)] transition-all focus-within:border-white/20 focus-within:ring-1 focus-within:ring-[#C5C5C5]/20 shadow-inner">
      <MenuBar editor={editor} onImageUpload={onImageUpload} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;
