'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Divider
} from '@mui/material'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Service Imports
import authService from '../services/authService'

// Hook Imports
import useAuth from '../hooks/useAuth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const [isPasswordShown, setIsPasswordShown] = useState(false)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await authService.login({ email, password })
      if (response.data.success) {
        login(response.data.token, response.data.data)
        router.push('/home')
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
      setOpen(true)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='sm:!p-12'>
          <div className='flex justify-center mbe-6'>
            <Logo />
          </div>
          <div className='flex flex-col gap-1 mbe-6'>
            <Typography>Sign-in to your account</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <CustomTextField
              autoFocus
              fullWidth
              label='Email'
              placeholder='Enter your email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <CustomTextField
              fullWidth
              label='Password'
              placeholder='············'
              type={isPasswordShown ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                      <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel control={<Checkbox />} label='Remember me' />
              <Typography className='text-end' color='primary' component={Link} href='/forgot-password'>
                Forgot password?
              </Typography>
            </div>
            <Button fullWidth variant='contained' type='submit'>
              Login
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography component={Link} href='/register' color='primary'>
                Create an account
              </Typography>
            </div>
            <Button variant='outlined' fullWidth onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </form>
        </CardContent>
      </Card>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Login
