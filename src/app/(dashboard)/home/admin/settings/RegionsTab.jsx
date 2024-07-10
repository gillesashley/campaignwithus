'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { Card, CardHeader, Button, Snackbar, Alert, Grid, Typography, Paper } from '@mui/material'
import AddRegionDrawer from './AddRegionDrawer'
import EditRegionDrawer from './EditRegionDrawer'

// Service Imports
import regionService from '../../../../../services/regionService'

// Hook Imports
import useAuth from '../../../../../hooks/useAuth'

const RegionsTab = () => {
  const { token } = useAuth()
  const [regions, setRegions] = useState([])
  const [addRegionOpen, setAddRegionOpen] = useState(false)
  const [editRegionOpen, setEditRegionOpen] = useState(false)
  const [editRegionId, setEditRegionId] = useState(null)
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
        setSnackbarMessage('Failed to fetch regions')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      }
    }
    if (token) {
      fetchRegions()
    }
  }, [token])

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleEditClick = regionId => {
    setEditRegionId(regionId)
    setEditRegionOpen(true)
  }

  const handleRegionUpdated = () => {
    setEditRegionOpen(false)
    setAddRegionOpen(false)
    const fetchRegions = async () => {
      try {
        const response = await regionService.getRegions()
        setRegions(response.data.data)
      } catch (error) {
        console.error('Failed to fetch regions:', error)
      }
    }
    fetchRegions()
  }

  return (
    <>
      <div className='p-4'>
        <Button variant='contained' onClick={() => setAddRegionOpen(true)}>
          Add New Region
        </Button>
      </div>
      <Paper className='p-4'>
        <Grid container spacing={2}>
          {regions.map(region => (
            <Grid item xs={12} sm={6} key={region._id} onClick={() => handleEditClick(region._id)}>
              <Card className='p-2 cursor-pointer'>
                <Typography variant='body1'>{region.name}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      <AddRegionDrawer
        open={addRegionOpen}
        handleClose={() => setAddRegionOpen(false)}
        onRegionUpdated={handleRegionUpdated}
      />
      <EditRegionDrawer
        open={editRegionOpen}
        handleClose={() => setEditRegionOpen(false)}
        regionId={editRegionId}
        onRegionUpdated={handleRegionUpdated}
      />
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default RegionsTab
