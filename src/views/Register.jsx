'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  Autocomplete
} from '@mui/material'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Service Imports
import authService from '../services/authService'
import regionService from '../services/regionService'
import constituencyService from '../services/constituencyService'

// Hook Imports
import useAuth from '../hooks/useAuth'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [region, setRegion] = useState(null)
  const [constituency, setConstituency] = useState(null)
  const [regions, setRegions] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await regionService.getRegions()
        setRegions(response.data.data)
      } catch (err) {
        console.error('Failed to fetch regions:', err)
      }
    }

    fetchRegions()
  }, [])

  useEffect(() => {
    const fetchConstituencies = async () => {
      if (region) {
        try {
          const response = await constituencyService.getConstituencies(region._id)
          setConstituencies(response.data.data)
        } catch (err) {
          console.error('Failed to fetch constituencies:', err)
        }
      } else {
        setConstituencies([])
      }
    }

    fetchConstituencies()
  }, [region])

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const response = await authService.register({
        name,
        email,
        password,
        phoneNumber,
        region: region?._id,
        constituency: constituency?._id
      })
      login(response.data.token, response.data.data)
      router.push('/home')
    } catch (err) {
      console.error('Register error:', err)
      setError(err.response?.data?.message || 'An error occurred')
      setOpen(true)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box display='flex' justifyContent='center' marginTop={4} alignItems='center' height='100vh' padding={2}>
      <Card className='flex flex-col sm:is-[450px] w-full max-w-md'>
        <CardContent className='sm:!p-12'>
          <div className='flex justify-center mbe-4'>
            <Logo />
          </div>
          <div className='flex flex-col gap-1 mbe-4'>
            <Typography>Create an account to Campaign With Us</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <CustomTextField
              autoFocus
              fullWidth
              label='Name'
              placeholder='Enter your full name'
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <CustomTextField
              fullWidth
              label='Email'
              placeholder='Enter your email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <CustomTextField
              fullWidth
              label='Password'
              placeholder='············'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <CustomTextField
              fullWidth
              label='Phone Number'
              placeholder='Enter your phone number'
              type='text'
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
            />
            <Autocomplete
              options={regions}
              getOptionLabel={option => option.name}
              value={region}
              onChange={(e, newValue) => setRegion(newValue)}
              renderInput={params => <CustomTextField {...params} label='Region' required />}
            />
            <Autocomplete
              options={constituencies}
              getOptionLabel={option => option.name}
              value={constituency}
              onChange={(e, newValue) => setConstituency(newValue)}
              renderInput={params => <CustomTextField {...params} label='Constituency' />}
              disabled={!region}
            />
            <Button fullWidth variant='contained' type='submit'>
              Register
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Already have an account?</Typography>
              <Typography component={Link} href='/login' color='primary'>
                Sign in
              </Typography>
            </div>
            <Button variant='outlined' fullWidth onClick={() => router.push('/')} sx={{ mt: 2 }}>
              Back to Home
            </Button>
          </form>
        </CardContent>
      </Card>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Register
