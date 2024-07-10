'use client'

// MUI Imports
import Divider from '@mui/material/Divider'

// Third-party imports
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import { Button } from '@mui/material'

// Components Imports

const EditorToolbar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 p-6'>
      <Button
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className='tabler-bold' />
      </Button>
      <Button
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className='tabler-underline' />
      </Button>
      <Button
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className='tabler-italic' />
      </Button>
      <Button
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className='tabler-strikethrough' />
      </Button>
      <Button
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i className='tabler-align-left' />
      </Button>
      <Button
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <i className='tabler-align-center' />
      </Button>
      <Button
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <i className='tabler-align-right' />
      </Button>
      <Button
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <i className='tabler-align-justified' />
      </Button>
    </div>
  )
}

export const EditorBasic = ({ content }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something here...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],

    content:
      content !== null && content !== void 0
        ? content
        : `
      <p>
Delete and type your content here!
      </p>
      <br />
      <p>
This is a sample paragraph      </p>
    `
  })

  return (
    <div className='border rounded-md'>
      <EditorToolbar editor={editor} />
      <Divider />
      <EditorContent editor={editor} className='bs-[200px] overflow-y-auto flex' />
    </div>
  )
}
