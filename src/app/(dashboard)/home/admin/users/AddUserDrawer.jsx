'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import {
  Button,
  Drawer,
  IconButton,
  Typography,
  Divider,
  Snackbar,
  MenuItem,
  Alert,
  Autocomplete,
  TextField
} from '@mui/material'

// Service Imports
import userService from '../../../../../services/userService'
import regionService from '../../../../../services/regionService'
import constituencyService from '../../../../../services/constituencyService'

// Hook Imports
import useAuth from '../../../../../hooks/useAuth'

const initialData = {
  name: '',
  email: '',
  password: '',
  region: null,
  constituency: null,
  location: '',
  phoneNumber: '',
  isAdmin: false
}

const AddUserDrawer = ({ open, handleClose, onUserAdded }) => {
  const { token } = useAuth()
  const [formData, setFormData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [regions, setRegions] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await regionService.getRegions()
        setRegions(response.data.data)
      } catch (error) {
        console.error('Failed to fetch regions:', error)
      }
    }
    fetchRegions()
  }, [])

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

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await userService.createUser(formData, token)
      setSnackbarMessage('User added successfully')
      setSnackbarSeverity('success')
      handleClose()
      setFormData(initialData)
      onUserAdded()
    } catch (error) {
      console.error('Failed to add user:', error)
      setSnackbarMessage('Failed to add user')
      setSnackbarSeverity('error')
    } finally {
      setLoading(false)
      setSnackbarOpen(true)
    }
  }

  const handleReset = () => {
    handleClose()
    setFormData(initialData)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <>
      <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={handleReset}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
      >
        <div className='flex items-center justify-between plb-5 pli-6'>
          <Typography variant='h5'>Add New User</Typography>
          <IconButton onClick={handleReset}>
            <i className='tabler-x text-textPrimary' />
          </IconButton>
        </div>
        <Divider />
        <div>
          <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-6'>
            <TextField
              label='Name'
              fullWidth
              placeholder='John Doe'
              value={formData.name}
              onChange={e => handleFormChange('name', e.target.value)}
            />
            <TextField
              label='Email'
              fullWidth
              placeholder='johndoe@gmail.com'
              autoComplete='off'
              value={formData.email}
              onChange={e => handleFormChange('email', e.target.value)}
            />
            <TextField
              label='Password'
              fullWidth
              type='password'
              placeholder='Password'
              autoComplete='off'
              value={formData.password}
              onChange={e => handleFormChange('password', e.target.value)}
            />
            <TextField
              label='Phone Number'
              fullWidth
              placeholder='+1 (234) 567-8901'
              value={formData.phoneNumber}
              onChange={e => handleFormChange('phoneNumber', e.target.value)}
            />
            <TextField
              label='Location'
              fullWidth
              placeholder='Location'
              value={formData.location}
              onChange={e => handleFormChange('location', e.target.value)}
            />
            <Autocomplete
              fullWidth
              options={regions}
              getOptionLabel={option => option.name}
              value={formData.region || null}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              onChange={(e, newValue) => handleFormChange('region', newValue)}
              renderInput={params => <TextField {...params} label='Region' />}
            />
            <Autocomplete
              fullWidth
              options={constituencies}
              getOptionLabel={option => option.name}
              value={formData.constituency || null}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              onChange={(e, newValue) => handleFormChange('constituency', newValue)}
              renderInput={params => <TextField {...params} label='Constituency' />}
            />
            <TextField
              select
              fullWidth
              id='select-role'
              value={formData.isAdmin ? 'admin' : 'user'}
              onChange={e => handleFormChange('isAdmin', e.target.value === 'admin')}
              label='Select Role'
            >
              <MenuItem value='admin'>Admin</MenuItem>
              <MenuItem value='user'>User</MenuItem>
            </TextField>
            <div className='flex items-center gap-4'>
              <Button variant='contained' type='submit' disabled={loading}>
                Submit
              </Button>
              <Button variant='tonal' color='error' type='reset' onClick={handleReset}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Drawer>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default AddUserDrawer
