import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button, List, ListItem, Typography, IconButton } from '@mui/material'
import userService from '../../../../services/userService'
import useAuth from '../../../../hooks/useAuth'

const FileUploaderMultiple = ({ setBanners }) => {
  const [files, setFiles] = useState([])
  const { user, token, login } = useAuth()

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
    }
  })

  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file)} />
    } else {
      return <i className='tabler-file-description' />
    }
  }

  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  }

  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  const handleUpload = async () => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('bannerUrls', file)
    })

    try {
      const response = await userService.updateBannerPhotos(user._id, formData, token)
      login(token, response.data.data)
      setBanners(response.data.data.bannerUrls)
      handleRemoveAllFiles()
    } catch (error) {
      console.error('Failed to upload banners:', error)
    }
  }

  const fileList = files.map(file => (
    <ListItem key={file.name} className='flex justify-between items-center'>
      <div className='flex items-center'>
        <div className='mr-4'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='font-medium'>{file.name}</Typography>
          <Typography variant='body2' className='text-gray-600'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='tabler-x text-xl' />
      </IconButton>
    </ListItem>
  ))

  return (
    <>
      <div
        {...getRootProps({
          className: 'flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-md cursor-pointer'
        })}
      >
        <input {...getInputProps()} />
        <div className='flex items-center flex-col'>
          <div className='flex justify-center items-center w-12 h-12 bg-gray-200 rounded-full mb-3'>
            <i className='tabler-upload text-xl text-gray-700' />
          </div>
          <Typography variant='h4' className='mb-2.5'>
            Drop files here or click to upload.
          </Typography>
          <Typography>
            Drop files here or click{' '}
            <a href='/' onClick={e => e.preventDefault()} className='text-blue-500 underline'>
              browse
            </a>{' '}
            thorough your machine
          </Typography>
        </div>
      </div>
      {files.length ? (
        <>
          <List className='mt-4'>{fileList}</List>
          <div className='flex justify-between mt-4'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
            <Button variant='contained' onClick={handleUpload}>
              Upload Files
            </Button>
          </div>
        </>
      ) : null}
    </>
  )
}

export default FileUploaderMultiple
