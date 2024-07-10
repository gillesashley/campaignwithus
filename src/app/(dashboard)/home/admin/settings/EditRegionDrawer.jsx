'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { Button, Drawer, IconButton, Typography, Divider, Snackbar, Alert, TextField } from '@mui/material'

// Service Imports
import regionService from '../../../../../services/regionService'

// Hook Imports
import useAuth from '../../../../../hooks/useAuth'

const initialData = {
  name: ''
}

const EditRegionDrawer = ({ open, handleClose, regionId, onRegionUpdated }) => {
  const { token } = useAuth()
  const [formData, setFormData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  useEffect(() => {
    const fetchRegion = async () => {
      if (regionId) {
        try {
          const response = await regionService.getRegion(regionId, token)
          setFormData(response.data.data)
        } catch (error) {
          console.error('Failed to fetch region:', error)
        }
      }
    }
    fetchRegion()
  }, [regionId, token])

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await regionService.updateRegion(regionId, formData, token)
      setSnackbarMessage('Region updated successfully')
      setSnackbarSeverity('success')
      handleClose()
      setFormData(initialData)
      onRegionUpdated()
    } catch (error) {
      console.error('Failed to update region:', error)
      setSnackbarMessage('Failed to update region')
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
          <Typography variant='h5'>Edit Region</Typography>
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
              placeholder='Region Name'
              value={formData.name}
              onChange={e => handleFormChange('name', e.target.value)}
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

export default EditRegionDrawer
