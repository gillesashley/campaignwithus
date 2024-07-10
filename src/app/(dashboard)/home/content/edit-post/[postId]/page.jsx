'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  Card,
  CardContent,
  Button,
  Typography,
  Grid,
  Snackbar,
  Alert,
  TextField,
  Autocomplete,
  Box,
  Avatar,
  Divider
} from '@mui/material'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { useDropzone } from 'react-dropzone'
import postService from '../../../../../../services/postService'
import regionService from '../../../../../../services/regionService'
import constituencyService from '../../../../../../services/constituencyService'
import industryService from '../../../../../../services/industryService'
import useAuth from '../../../../../../hooks/useAuth'

const EditorToolbar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 p-2'>
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        variant={editor.isActive('bold') ? 'contained' : 'outlined'}
        size='small'
      >
        <i className='tabler-bold' />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        variant={editor.isActive('underline') ? 'contained' : 'outlined'}
        size='small'
      >
        <i className='tabler-underline' />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        variant={editor.isActive('italic') ? 'contained' : 'outlined'}
        size='small'
      >
        <i className='tabler-italic' />
      </Button>
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        variant={editor.isActive('strike') ? 'contained' : 'outlined'}
        size='small'
      >
        <i className='tabler-strikethrough' />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        variant={editor.isActive({ textAlign: 'left' }) ? 'contained' : 'outlined'}
        size='small'
      >
        <i className='tabler-align-left' />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        variant={editor.isActive({ textAlign: 'center' }) ? 'contained' : 'outlined'}
        size='small'
      >
        <i className='tabler-align-center' />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        variant={editor.isActive({ textAlign: 'right' }) ? 'contained' : 'outlined'}
        size='small'
      >
        <i className='tabler-align-right' />
      </Button>
      <Button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        variant={editor.isActive({ textAlign: 'justify' }) ? 'contained' : 'outlined'}
        size='small'
      >
        <i className='tabler-align-justified' />
      </Button>
    </div>
  )
}

const FileUploaderSingle = ({ onFileSelect, reset, initialImage }) => {
  const [files, setFiles] = useState([])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
      onFileSelect(acceptedFiles[0])
    }
  })

  useEffect(() => {
    if (reset) {
      setFiles([])
    }
  }, [reset])

  const img = files.map(file => (
    <img
      key={file.name}
      alt={file.name}
      className='single-file-image'
      src={URL.createObjectURL(file)}
      style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
    />
  ))

  return (
    <Box
      {...getRootProps({ className: 'dropzone' })}
      sx={{
        height: files.length || initialImage ? 'auto' : 450,
        border: '1px dashed #ccc',
        borderRadius: '4px',
        padding: '16px',
        textAlign: 'center'
      }}
    >
      <input {...getInputProps()} />
      {files.length ? (
        img
      ) : initialImage ? (
        <img
          alt='initial'
          className='single-file-image'
          src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${initialImage}`}
          style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
        />
      ) : (
        <div className='flex items-center flex-col'>
          <Avatar variant='rounded' sx={{ width: 48, height: 48, mb: 2 }}>
            <i className='tabler-upload' />
          </Avatar>
          <Typography variant='h6'>Drop files here or click to upload.</Typography>
          <Typography>Browse through your machine</Typography>
        </div>
      )}
    </Box>
  )
}

const EditPost = () => {
  const { user, token } = useAuth()
  const router = useRouter()
  const { postId } = useParams()
  const [formData, setFormData] = useState({
    title: '',
    constituencyId: null,
    regionId: null,
    industryId: null
  })
  const [initialImage, setInitialImage] = useState(null)
  const [fileInput, setFileInput] = useState(null)
  const [fileReset, setFileReset] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [regions, setRegions] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [industries, setIndustries] = useState([])

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
    content: '',
    autofocus: true
  })

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await postService.getPost(postId, token)
        const postData = response.data.data
        setFormData({
          title: postData.title,
          constituencyId: postData.constituencyId,
          regionId: postData.regionId,
          industryId: postData.industryId
        })
        setInitialImage(postData.imageUrl)
        editor?.commands.setContent(postData.content)
      } catch (error) {
        console.error('Failed to fetch post data:', error)
      }
    }

    const fetchRegions = async () => {
      try {
        const response = await regionService.getRegions()
        setRegions(response.data.data)
      } catch (error) {
        console.error('Failed to fetch regions:', error)
      }
    }

    const fetchIndustries = async () => {
      try {
        const response = await industryService.getIndustries()
        setIndustries(response.data.data)
      } catch (error) {
        console.error('Failed to fetch industries:', error)
      }
    }

    fetchPostData()
    fetchRegions()
    fetchIndustries()
  }, [postId, token, editor])

  const fetchConstituencies = async regionId => {
    try {
      const response = await constituencyService.getConstituencies(regionId)
      setConstituencies(response.data.data)
    } catch (error) {
      console.error('Failed to fetch constituencies:', error)
    }
  }

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value })

    if (field === 'regionId') {
      fetchConstituencies(value._id)
    }
  }

  const handleFileInputChange = file => {
    setFileInput(file)
  }

  const handleFileInputReset = () => {
    setFileInput(null)
    setFileReset(true)
    setTimeout(() => setFileReset(false), 1000)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const postData = {
      ...formData,
      content: editor.getHTML(),
      userId: user._id
    }

    try {
      await postService.updatePost(postId, postData, token)

      if (fileInput) {
        const imageData = new FormData()
        imageData.append('imageUrl', fileInput)
        await postService.uploadPostImage(postId, imageData, token)
      }

      setSnackbarMessage('Post updated successfully')
      setSnackbarSeverity('success')
      router.push('/home/content')
    } catch (error) {
      console.error('Failed to update post:', error)
      setSnackbarMessage('Failed to update post')
      setSnackbarSeverity('error')
    } finally {
      setSnackbarOpen(true)
    }
  }

  const handleDelete = async () => {
    try {
      await postService.deletePost(postId, token)
      setSnackbarMessage('Post deleted successfully')
      setSnackbarSeverity('success')
      router.push('/home/content')
    } catch (error) {
      console.error('Failed to delete post:', error)
      setSnackbarMessage('Failed to delete post')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <>
      <Card className='p-4'>
        <Typography variant='h5' className='mb-4'>
          Edit Post
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label='Title'
                value={formData.title}
                onChange={e => handleFormChange('title', e.target.value)}
              />
              <div className='border rounded-md mt-4'>
                <EditorToolbar editor={editor} />
                <Divider />
                <div className='p-4' style={{ minHeight: '200px' }}>
                  <EditorContent editor={editor} />
                </div>
              </div>
              <Autocomplete
                fullWidth
                options={regions}
                getOptionLabel={option => option.name}
                value={formData.regionId}
                onChange={(e, newValue) => handleFormChange('regionId', newValue)}
                renderInput={params => <TextField {...params} label='Region' />}
                className='mt-4'
              />
              <Autocomplete
                fullWidth
                options={constituencies}
                getOptionLabel={option => option.name}
                value={formData.constituencyId}
                onChange={(e, newValue) => handleFormChange('constituencyId', newValue)}
                renderInput={params => <TextField {...params} label='Constituency' />}
                className='mt-4'
              />
              <Autocomplete
                fullWidth
                options={industries}
                getOptionLabel={option => option.name}
                value={formData.industryId}
                onChange={(e, newValue) => handleFormChange('industryId', newValue)}
                renderInput={params => <TextField {...params} label='Industry' />}
                className='mt-4'
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FileUploaderSingle onFileSelect={handleFileInputChange} reset={fileReset} initialImage={initialImage} />
              {fileInput && (
                <Button variant='contained' color='secondary' onClick={handleFileInputReset} className='mt-4'>
                  Reset
                </Button>
              )}
            </Grid>
            <Grid item xs={12} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit'>
                Update Post
              </Button>
              <Button variant='contained' color='secondary' onClick={() => router.push('/home/content')}>
                Cancel
              </Button>
              <Button variant='contained' color='error' onClick={handleDelete}>
                Delete Post
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default EditPost
