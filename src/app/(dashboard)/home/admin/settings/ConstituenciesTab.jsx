'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import { Card, CardHeader, Button, Snackbar, Alert, Grid, Typography, Paper } from '@mui/material'
import AddConstituencyDrawer from './AddConstituencyDrawer'
import EditConstituencyDrawer from './EditConstituencyDrawer'

// Service Imports
import constituencyService from '../../../../../services/constituencyService'

// Hook Imports
import useAuth from '../../../../../hooks/useAuth'

const ConstituenciesTab = () => {
  const { token } = useAuth()
  const [constituencies, setConstituencies] = useState([])
  const [addConstituencyOpen, setAddConstituencyOpen] = useState(false)
  const [editConstituencyOpen, setEditConstituencyOpen] = useState(false)
  const [editConstituencyId, setEditConstituencyId] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const response = await constituencyService.getConstituencies(null)
        setConstituencies(response.data.data)
      } catch (error) {
        console.error('Failed to fetch constituencies:', error)
        setSnackbarMessage('Failed to fetch constituencies')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      }
    }
    if (token) {
      fetchConstituencies()
    }
  }, [token])

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleEditClick = constituencyId => {
    setEditConstituencyId(constituencyId)
    setEditConstituencyOpen(true)
  }

  const handleConstituencyUpdated = () => {
    setEditConstituencyOpen(false)
    setAddConstituencyOpen(false)
    const fetchConstituencies = async () => {
      try {
        const response = await constituencyService.getConstituencies(null)
        setConstituencies(response.data.data)
      } catch (error) {
        console.error('Failed to fetch constituencies:', error)
      }
    }
    fetchConstituencies()
  }

  return (
    <>
      <div className='p-4'>
        <Button variant='contained' onClick={() => setAddConstituencyOpen(true)}>
          Add New Constituency
        </Button>
      </div>
      <Paper className='p-4'>
        <Grid container spacing={2}>
          {constituencies.map(constituency => (
            <Grid item xs={12} sm={6} key={constituency._id} onClick={() => handleEditClick(constituency._id)}>
              <Card className='p-2 cursor-pointer'>
                <Typography variant='body1'>{constituency.name}</Typography>
                <Typography variant='body2' color='textSecondary'>
                  {constituency.regionId?.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      <AddConstituencyDrawer
        open={addConstituencyOpen}
        handleClose={() => setAddConstituencyOpen(false)}
        onConstituencyUpdated={handleConstituencyUpdated}
      />
      <EditConstituencyDrawer
        open={editConstituencyOpen}
        handleClose={() => setEditConstituencyOpen(false)}
        constituencyId={editConstituencyId}
        onConstituencyUpdated={handleConstituencyUpdated}
      />
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ConstituenciesTab
