'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { Box, Button, Card, CardContent, TextField, Typography, Snackbar, Alert } from '@mui/material'

// Service Imports
import authService from '../services/authService'

// Component Imports
import Logo from '@components/layout/shared/Logo'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await authService.forgotPassword({ email })
      setLoading(false)
      if (response.data.success) {
        setError('Password reset email sent successfully')
        setAlertSeverity('success')
        setOpen(true)
      } else {
        throw new Error('Failed to send reset email')
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
            <Typography variant='h4'>Forgot Password</Typography>
            <Typography>Enter your email to reset your password</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <TextField
              autoFocus
              fullWidth
              label='Email'
              placeholder='Enter your email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Button fullWidth variant='contained' type='submit' disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Email'}
            </Button>
            <Button
              variant='outlined'
              fullWidth
              onClick={() => router.push('/login')}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              Back to Login
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

export default ForgotPassword
