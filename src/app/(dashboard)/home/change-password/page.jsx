'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import { Grid, Card, CardContent, Button, Typography, Snackbar, Alert, InputAdornment, IconButton } from '@mui/material'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import useAuth from '../../../../hooks/useAuth'

// Service Imports
import authService from '../../../../services/authService'

const ChangePassword = () => {
  const [isCurrentPasswordShown, setIsCurrentPasswordShown] = useState(false)
  const [isNewPasswordShown, setIsNewPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const { token } = useAuth()

  const handleClickShowCurrentPassword = () => {
    setIsCurrentPasswordShown(!isCurrentPasswordShown)
  }

  const handleClickShowNewPassword = () => {
    setIsNewPasswordShown(!isNewPasswordShown)
  }

  const handleClickShowConfirmPassword = () => {
    setIsConfirmPasswordShown(!isConfirmPasswordShown)
  }

  const handlePasswordUpdate = async e => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setSnackbarMessage('Passwords do not match')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
      return
    }

    try {
      const response = await authService.updatePassword({ currentPassword, newPassword }, token)
      setSnackbarMessage('Password updated successfully')
      setSnackbarSeverity('success')
    } catch (error) {
      console.error('Failed to update password:', error)
      setSnackbarMessage('Failed to update password')
      setSnackbarSeverity('error')
    } finally {
      setSnackbarOpen(true)
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant='h5' gutterBottom>
            Change Password
          </Typography>
          <form onSubmit={handlePasswordUpdate}>
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Current Password'
                  type={isCurrentPasswordShown ? 'text' : 'password'}
                  placeholder='············'
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowCurrentPassword}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isCurrentPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='New Password'
                  type={isNewPasswordShown ? 'text' : 'password'}
                  placeholder='············'
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowNewPassword}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isNewPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Confirm New Password'
                  type={isConfirmPasswordShown ? 'text' : 'password'}
                  placeholder='············'
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} className='flex flex-col gap-4'>
                <Typography variant='h6'>Password Requirements:</Typography>
                <div className='flex flex-col gap-4'>
                  <div className='flex items-center gap-2.5'>
                    <i className='tabler-circle-filled text-[8px]' />
                    Minimum 8 characters long - the more, the better
                  </div>
                  <div className='flex items-center gap-2.5'>
                    <i className='tabler-circle-filled text-[8px]' />
                    At least one lowercase & one uppercase character
                  </div>
                  <div className='flex items-center gap-2.5'>
                    <i className='tabler-circle-filled text-[8px]' />
                    At least one number, symbol, or whitespace character
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} className='flex gap-4'>
                <Button variant='contained' type='submit'>
                  Save
                </Button>
                <Button variant='tonal' type='reset' color='secondary'>
                  Reset
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ChangePassword
