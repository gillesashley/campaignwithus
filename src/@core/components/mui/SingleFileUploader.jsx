// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

export const FileUploaderSingle = () => {
  // States
  const [files, setFiles] = useState([])

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))
    }
  })

  const img = files.map(file => (
    <img key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file)} />
  ))

  return (
    <Box {...getRootProps({ className: 'dropzone' })} {...(files.length && { sx: { height: 450 } })}>
      <input {...getInputProps()} />
      {files.length ? (
        img
      ) : (
        <div className='flex items-center flex-col'>
          <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
            <i className='tabler-upload' />
          </Avatar>
          <Typography variant='h4' className='mbe-2.5'>
            Drop files here or click to upload.
          </Typography>
          <Typography>
            Drop files here or click{' '}
            <a href='/' onClick={e => e.preventDefault()} className='text-textPrimary no-underline'>
              browse
            </a>{' '}
            thorough your machine
          </Typography>
        </div>
      )}
    </Box>
  )
}
