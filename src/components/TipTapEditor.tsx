import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageResize from 'tiptap-extension-resize-image';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Placeholder } from '@tiptap/extension-placeholder';
import { all, createLowlight } from 'lowlight';
import 'highlight.js/styles/atom-one-dark.css'; // Add syntax highlighting theme
import { 
  FiBold, FiItalic, FiUnderline, 
  FiList, FiAlignLeft, FiAlignCenter, FiAlignRight, 
  FiLink, FiImage, FiCode 
} from 'react-icons/fi';
import { FaStrikethrough, FaQuoteRight } from 'react-icons/fa';
import { MdOutlineFormatListNumbered } from 'react-icons/md';
import { LuHeading1, LuHeading2, LuHeading3, LuHeading4 } from "react-icons/lu";
import { 
  TbRowInsertTop, TbRowInsertBottom, TbColumnInsertLeft, TbColumnInsertRight, 
  TbRowRemove, TbColumnRemove, TbTableMinus 
} from "react-icons/tb";
import Button from "./Button";

const lowlight = createLowlight(all);

interface TipTapEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
  readOnly?: boolean;
  minimal?: boolean;
}

const MenuBar = ({ editor, onImageUpload, minimal }: { editor: any, onImageUpload?: (file: File) => Promise<string>, minimal?: boolean }) => {
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);

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
          setIsUploadingImage(true);
          // Insert a temporary placeholder image that matches the platform's loading screen
          const loadingSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='100' viewBox='0 0 800 100'%3E%3Crect width='800' height='100' fill='%230a0a0a' rx='16'/%3E%3Crect x='300' y='40' width='200' height='2' fill='%23ffffff' fill-opacity='0.05'/%3E%3Crect x='300' y='40' width='50' height='2' fill='%23C5C5C5'%3E%3Canimate attributeName='x' values='300; 450; 300' dur='2s' repeatCount='indefinite'/%3E%3C/rect%3E%3Ctext x='400' y='65' font-family='system-ui, sans-serif' font-size='10' font-weight='bold' letter-spacing='6' text-anchor='middle' fill='%23555555'%3EUPLOADING MEDIA...%3C/text%3E%3C/svg%3E";
          
          // Get the current position
          
          // Insert the placeholder
          editor.chain().focus().setImage({ src: loadingSvg }).run();
          
          const url = await onImageUpload(file);
          
          // Find the placeholder and replace it with the real image
          let placeholderPos = -1;
          editor.state.doc.descendants((node: any, pos: number) => {
            if (node.type.name === 'image' && node.attrs.src === loadingSvg) {
              placeholderPos = pos;
            }
          });

          if (placeholderPos !== -1) {
            editor.chain().deleteRange({ from: placeholderPos, to: placeholderPos + 1 }).insertContentAt(placeholderPos, {
              type: 'image',
              attrs: { src: url }
            }).run();
          } else {
            // Fallback if placeholder was deleted by user
            editor.chain().focus().setImage({ src: url }).run();
          }
          
        } catch (error) {
          console.error("Image upload failed", error);
          // Remove placeholder on error
          let placeholderPos = -1;
          editor.state.doc.descendants((node: any, pos: number) => {
            if (node.type.name === 'image' && node.attrs.src.includes('UPLOADING MEDIA')) {
              placeholderPos = pos;
            }
          });
          if (placeholderPos !== -1) {
            editor.chain().deleteRange({ from: placeholderPos, to: placeholderPos + 1 }).run();
          }
        } finally {
          setIsUploadingImage(false);
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

  const getVariant = (isActive: boolean) => isActive ? "secondary" : "ghost";

  return (
    <div className="flex flex-wrap gap-1 p-3 bg-[#141414] border-b border-white/10 sticky top-0 z-10">
      <Button type="button" onClick={() => editor.chain().focus().toggleBold().run()} variant={getVariant(editor.isActive('bold'))} size="xs" icon title="Bold"><FiBold /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} variant={getVariant(editor.isActive('italic'))} size="xs" icon title="Italic"><FiItalic /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} variant={getVariant(editor.isActive('underline'))} size="xs" icon title="Underline"><FiUnderline /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} variant={getVariant(editor.isActive('strike'))} size="xs" icon title="Strike"><FaStrikethrough /></Button>
      
      {!minimal && (
        <>
          <div className="w-px h-6 bg-white/10 mx-2 my-auto"></div>
          
          <Button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} variant={getVariant(editor.isActive('heading', { level: 1 }))} size="xs" icon title="H1"><LuHeading1 /></Button>
          <Button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} variant={getVariant(editor.isActive('heading', { level: 2 }))} size="xs" icon title="H2"><LuHeading2 /></Button>
          <Button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} variant={getVariant(editor.isActive('heading', { level: 3 }))} size="xs" icon title="H3"><LuHeading3 /></Button>
          <Button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} variant={getVariant(editor.isActive('heading', { level: 4 }))} size="xs" icon title="H4"><LuHeading4 /></Button>
        </>
      )}
      
      <div className="w-px h-6 bg-white/10 mx-2 my-auto"></div>
      
      <Button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} variant={getVariant(editor.isActive('bulletList'))} size="xs" icon title="Bullet List"><FiList /></Button>
      <Button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} variant={getVariant(editor.isActive('orderedList'))} size="xs" icon title="Ordered List"><MdOutlineFormatListNumbered /></Button>
      
      {!minimal && (
        <>
          <div className="w-px h-6 bg-white/10 mx-2 my-auto"></div>
          
          <Button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} variant={getVariant(editor.isActive({ textAlign: 'left' }))} size="xs" icon title="Align Left"><FiAlignLeft /></Button>
          <Button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} variant={getVariant(editor.isActive({ textAlign: 'center' }))} size="xs" icon title="Align Center"><FiAlignCenter /></Button>
          <Button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} variant={getVariant(editor.isActive({ textAlign: 'right' }))} size="xs" icon title="Align Right"><FiAlignRight /></Button>
          
          <div className="w-px h-6 bg-white/10 mx-2 my-auto"></div>

          <Button type="button" onClick={setLink} variant={getVariant(editor.isActive('link'))} size="xs" icon title="Link"><FiLink /></Button>
          <Button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} variant={getVariant(editor.isActive('blockquote'))} size="xs" icon title="Quote"><FaQuoteRight /></Button>
          <Button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} variant={getVariant(editor.isActive('codeBlock'))} size="xs" icon title="Code Block"><FiCode /></Button>
          {onImageUpload && (
            <Button type="button" onClick={addImage} variant="ghost" size="xs" title="Image" disabled={isUploadingImage}>
              {isUploadingImage ? <span className="animate-pulse text-[8px] font-bold tracking-widest px-1">...</span> : <FiImage />}
            </Button>
          )}
          <Button type="button" onClick={addTable} variant={getVariant(editor.isActive('table'))} size="xs" icon title="Table">
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
          </Button>
          
          {editor.isActive('table') && (
            <>
              <div className="w-px h-6 bg-white/10 mx-2 my-auto"></div>
              <Button type="button" onClick={() => editor.chain().focus().addRowBefore().run()} variant="ghost" size="xs" icon title="Add Row Above"><TbRowInsertTop /></Button>
              <Button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} variant="ghost" size="xs" icon title="Add Row Below"><TbRowInsertBottom /></Button>
              <Button type="button" onClick={() => editor.chain().focus().deleteRow().run()} variant="ghost" size="xs" icon title="Delete Row"><TbRowRemove /></Button>
              
              <div className="w-px h-6 bg-white/10 mx-1 my-auto"></div>
              
              <Button type="button" onClick={() => editor.chain().focus().addColumnBefore().run()} variant="ghost" size="xs" icon title="Add Column Left"><TbColumnInsertLeft /></Button>
              <Button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} variant="ghost" size="xs" icon title="Add Column Right"><TbColumnInsertRight /></Button>
              <Button type="button" onClick={() => editor.chain().focus().deleteColumn().run()} variant="ghost" size="xs" icon title="Delete Column"><TbColumnRemove /></Button>
              
              <div className="w-px h-6 bg-white/10 mx-1 my-auto"></div>
              
              <Button type="button" onClick={() => editor.chain().focus().deleteTable().run()} variant="ghost" size="xs" icon title="Delete Table"><TbTableMinus className="text-red-400" /></Button>
            </>
          )}
        </>
      )}
    </div>
  );
};

const TipTapEditor: React.FC<TipTapEditorProps> = ({ value, onChange, placeholder, onImageUpload, readOnly = false, minimal = false }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      ImageResize,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-400 underline cursor-pointer',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: placeholder || 'Write something amazing...',
      }),
    ],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update content when value changes from outside
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Update editability when readOnly prop changes
  React.useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [readOnly, editor]);

  return (
    <div className={`prose prose-invert max-w-none w-full bg-[#141414] rounded-2xl overflow-hidden`}>
      {!readOnly && <MenuBar editor={editor} onImageUpload={onImageUpload} minimal={minimal} />}
      <EditorContent editor={editor} className={readOnly ? 'p-0' : 'p-6 min-h-[300px]'} />
    </div>
  );
};

export default TipTapEditor;
