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
  Alert,
  TextField,
  Autocomplete
} from '@mui/material'

// Service Imports
import constituencyService from '../../../../../services/constituencyService'
import regionService from '../../../../../services/regionService'

// Hook Imports
import useAuth from '../../../../../hooks/useAuth'

const initialData = {
  name: '',
  region: null
}

const AddConstituencyDrawer = ({ open, handleClose, onConstituencyUpdated }) => {
  const { token } = useAuth()
  const [formData, setFormData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [regions, setRegions] = useState([])
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

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await constituencyService.createConstituency({ ...formData, regionId: formData.region._id }, token)
      setSnackbarMessage('Constituency added successfully')
      setSnackbarSeverity('success')
      handleClose()
      setFormData(initialData)
      onConstituencyUpdated()
    } catch (error) {
      console.error('Failed to add constituency:', error)
      setSnackbarMessage('Failed to add constituency')
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
          <Typography variant='h5'>Add New Constituency</Typography>
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
              placeholder='Constituency Name'
              value={formData.name}
              onChange={e => handleFormChange('name', e.target.value)}
            />
            <Autocomplete
              fullWidth
              options={regions}
              getOptionLabel={option => option.name}
              value={formData.region || null}
              onChange={(e, newValue) => handleFormChange('region', newValue)}
              renderInput={params => <TextField {...params} label='Region' />}
            />
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

export default AddConstituencyDrawer
