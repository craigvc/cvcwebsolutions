'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className = ''
}: RichTextEditorProps) {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4]
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-400 hover:text-purple-300 underline'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg my-4'
        }
      })
    ],
    content: value,
    immediatelyRender: false, // Prevent SSR hydration issues
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-invert max-w-none px-4 py-3 min-h-[200px] focus:outline-none ${className}`,
      },
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const handleInsertImage = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageDialog(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-600 rounded-lg bg-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-600 bg-gray-800">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            editor.isActive('bold')
              ? 'bg-purple-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            editor.isActive('italic')
              ? 'bg-purple-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Italic
        </button>
        <div className="w-px h-8 bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-purple-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-purple-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          H3
        </button>
        <div className="w-px h-8 bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-purple-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-purple-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          1. List
        </button>
        <div className="w-px h-8 bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-purple-600 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          " Quote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1.5 text-sm font-medium rounded text-gray-300 hover:bg-gray-700 transition-colors"
        >
          — Rule
        </button>
        <button
          type="button"
          onClick={() => setShowImageDialog(true)}
          className="px-3 py-1.5 text-sm font-medium rounded text-gray-300 hover:bg-gray-700 transition-colors"
        >
          🖼️ Image
        </button>
        <div className="w-px h-8 bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="px-3 py-1.5 text-sm font-medium rounded text-gray-300 hover:bg-gray-700 transition-colors"
          disabled={!editor.can().undo()}
        >
          ↶ Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="px-3 py-1.5 text-sm font-medium rounded text-gray-300 hover:bg-gray-700 transition-colors"
          disabled={!editor.can().redo()}
        >
          ↷ Redo
        </button>
      </div>

      {/* Image URL Dialog */}
      {showImageDialog && (
        <div className="p-4 border-b border-gray-600 bg-gray-800">
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL..."
              className="flex-1 px-3 py-2 text-sm text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleInsertImage();
                }
              }}
            />
            <button
              type="button"
              onClick={handleInsertImage}
              disabled={!imageUrl}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert
            </button>
            <button
              type="button"
              onClick={() => {
                setShowImageDialog(false);
                setImageUrl('');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Enter the URL of an image to insert it into the content. The image will be displayed at full width with automatic sizing.
          </p>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        placeholder={placeholder}
      />
    </div>
  );
}