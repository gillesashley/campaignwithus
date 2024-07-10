'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter, useParams } from 'next/navigation'

// MUI Imports
import { Box, Button, Card, CardContent, TextField, Typography, Snackbar, Alert } from '@mui/material'

// Service Imports
import authService from '../services/authService'

// Component Imports
import Logo from '@components/layout/shared/Logo'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { resetToken } = useParams()

  const handleSubmit = async e => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setAlertSeverity('error')
      setOpen(true)
      return
    }
    setLoading(true)
    try {
      const response = await authService.resetPassword(resetToken, { password })
      setLoading(false)
      if (response.data.success) {
        router.push('/home')
      } else {
        throw new Error('Reset failed')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred')
      setAlertSeverity('error')
      setOpen(true)
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box display='flex' justifyContent='center' alignItems='center' height='100vh' padding={2}>
      <Card className='flex flex-col sm:is-[450px] w-full max-w-md'>
        <CardContent className='sm:!p-12'>
          <div className='flex justify-center mbe-6'>
            <Logo />
          </div>
          <div className='flex flex-col gap-1 mbe-6'>
            <Typography variant='h4'>Reset Password</Typography>
            <Typography>Enter your new password</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <TextField
              autoFocus
              fullWidth
              label='Password'
              placeholder='Enter your new password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label='Confirm Password'
              placeholder='Confirm your new password'
              type='password'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <Button fullWidth variant='contained' type='submit' disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
            <Button variant='outlined' fullWidth onClick={() => router.push('/')} disabled={loading} sx={{ mt: 2 }}>
              Back to Home
            </Button>
          </form>
        </CardContent>
      </Card>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ResetPassword
