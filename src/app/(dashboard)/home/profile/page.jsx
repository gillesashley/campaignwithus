'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// MUI Imports
import { Grid, Card, CardContent, Button, Typography, Snackbar, Alert, Autocomplete, TextField } from '@mui/material'
import Modal from 'react-modal'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import FileUploaderMultiple from './FileUploaderMultiple'

// Service Imports
import userService from '../../../../services/userService'
import regionService from '../../../../services/regionService'
import constituencyService from '../../../../services/constituencyService'

// Hook Imports
import useAuth from '../../../../hooks/useAuth'

const Profile = () => {
  const { user, token, login } = useAuth()
  const [formData, setFormData] = useState({})
  const [fileInput, setFileInput] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [regions, setRegions] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [banners, setBanners] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (user?.imageUrl) {
      setImgSrc(`${process.env.NEXT_PUBLIC_BASE_API_URL}/${user.imageUrl}`)
    } else {
      setImgSrc('/images/default.jpg')
    }

    if (user?.bannerUrls) {
      setBanners(user.bannerUrls)
    }
  }, [user])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await userService.getUser(user._id, token)
        setFormData(response.data.data)
        if (response.data.data.region) {
          fetchConstituencies(response.data.data.region._id)
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        setSnackbarMessage('Failed to fetch user data')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
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

    if (user && token) {
      fetchUserData()
      fetchRegions()
    }
  }, [user, token])

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
    if (field === 'region') {
      fetchConstituencies(value._id)
    }
  }

  const handleFileInputChange = file => {
    const reader = new FileReader()
    const { files } = file.target

    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])

      setFileInput(files[0])
    }
  }

  const handleFileInputReset = () => {
    setFileInput('')
    setImgSrc(`${process.env.NEXT_PUBLIC_BASE_API_URL}/${user?.imageUrl}`)
  }

  const handleProfileUpdate = async e => {
    e.preventDefault()

    // Exclude isAdmin from the formData
    const { isAdmin, ...updatedFormData } = formData

    try {
      const response = await userService.updateUserProfile(updatedFormData, token)
      login(token, response.data.data)
      setSnackbarMessage('Profile updated successfully')
      setSnackbarSeverity('success')
    } catch (error) {
      console.error('Failed to update profile:', error)
      setSnackbarMessage('Failed to update profile')
      setSnackbarSeverity('error')
    } finally {
      setSnackbarOpen(true)
    }
  }

  const handleImageUpload = async () => {
    if (fileInput) {
      const formData = new FormData()
      formData.append('imageUrl', fileInput)

      try {
        const response = await userService.updateProfilePhoto(user._id, formData, token)
        login(token, response.data.data)
        setImgSrc(`${process.env.NEXT_PUBLIC_BASE_API_URL}/${response.data.data.imageUrl}`)
        setSnackbarMessage('Profile photo updated successfully')
        setSnackbarSeverity('success')
      } catch (error) {
        console.error('Failed to update profile photo:', error)
        setSnackbarMessage('Failed to update profile photo')
        setSnackbarSeverity('error')
      } finally {
        setSnackbarOpen(true)
      }
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleRemoveProfilePhoto = async () => {
    try {
      const response = await userService.removeProfilePhoto(user._id, token)
      login(token, response.data.data)
      setImgSrc('/images/default.jpg')
      setSnackbarMessage('Profile photo removed successfully')
      setSnackbarSeverity('success')
    } catch (error) {
      console.error('Failed to remove profile photo:', error)
      setSnackbarMessage('Failed to remove profile photo')
      setSnackbarSeverity('error')
    } finally {
      setSnackbarOpen(true)
    }
  }

  const openModal = imageUrl => {
    setSelectedImage(imageUrl)
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setSelectedImage(null)
    setModalIsOpen(false)
  }

  const handleRemoveAllBanners = async () => {
    try {
      const response = await userService.removeBannerPhotos(user._id, token)
      login(token, response.data.data)
      setBanners([])
      setSnackbarMessage('All banners removed successfully')
      setSnackbarSeverity('success')
    } catch (error) {
      console.error('Failed to remove banners:', error)
      setSnackbarMessage('Failed to remove banners')
      setSnackbarSeverity('error')
    } finally {
      setSnackbarOpen(true)
    }
  }

  return (
    <>
      <Card>
        <CardContent className='mb-4'>
          <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6'>
            <img height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />
            <div className='flex flex-grow flex-col gap-4'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <Button component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Upload New Photo
                  <input
                    hidden
                    type='file'
                    accept='image/png, image/jpeg'
                    onChange={handleFileInputChange}
                    id='account-settings-upload-image'
                  />
                </Button>
                <Button variant='tonal' color='secondary' onClick={handleFileInputReset}>
                  Reset
                </Button>
                <Button variant='contained' onClick={handleImageUpload}>
                  Save Photo
                </Button>
                <Button variant='contained' color='error' onClick={handleRemoveProfilePhoto}>
                  Remove Photo
                </Button>
              </div>
              <Typography>Allowed JPG, GIF or PNG. Max size of 1MB</Typography>
            </div>
          </div>
        </CardContent>
        <CardContent>
          <form onSubmit={handleProfileUpdate}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Name'
                  value={formData.name || ''}
                  placeholder='John Doe'
                  onChange={e => handleFormChange('name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Email'
                  value={formData.email || ''}
                  placeholder='john.doe@gmail.com'
                  onChange={e => handleFormChange('email', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Phone Number'
                  value={formData.phoneNumber || ''}
                  placeholder='+1 (234) 567-8901'
                  onChange={e => handleFormChange('phoneNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Location'
                  value={formData.location || ''}
                  placeholder='Address'
                  onChange={e => handleFormChange('location', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  fullWidth
                  options={regions}
                  getOptionLabel={option => option.name}
                  value={formData.region || null}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(e, newValue) => handleFormChange('region', newValue)}
                  renderInput={params => <TextField {...params} label='Region' />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  fullWidth
                  options={constituencies}
                  getOptionLabel={option => option.name}
                  value={formData.constituency || null}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  onChange={(e, newValue) => handleFormChange('constituency', newValue)}
                  renderInput={params => <TextField {...params} label='Constituency' />}
                />
              </Grid>
              <Grid item xs={12} className='flex gap-4 flex-wrap'>
                <Button variant='contained' type='submit'>
                  Save
                </Button>
                <Button variant='contained' color='primary' onClick={() => router.push('/home/change-password')}>
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      {user && user.isAdmin && (
        <Card className='mt-6'>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Upload Banners
            </Typography>
            <FileUploaderMultiple setBanners={setBanners} />
            <div className='flex flex-wrap gap-4 mt-4'>
              {banners.map((banner, index) => (
                <img
                  key={index}
                  src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${banner}`}
                  alt={`Banner ${index + 1}`}
                  onClick={() => openModal(`${process.env.NEXT_PUBLIC_BASE_API_URL}/${banner}`)}
                  className='w-24 h-24 object-cover cursor-pointer'
                />
              ))}
            </div>
            <Button variant='contained' color='error' onClick={handleRemoveAllBanners} className='mt-4'>
              Remove All Banners
            </Button>
          </CardContent>
        </Card>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} className='w-full'>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Banner Image'
        className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'
      >
        {selectedImage && (
          <div className='bg-white p-6 rounded-lg'>
            <img src={selectedImage} alt='Banner' className='max-w-full max-h-screen mb-4' />
            <Button variant='contained' onClick={closeModal}>
              Close
            </Button>
          </div>
        )}
      </Modal>
    </>
  )
}

export default Profile
