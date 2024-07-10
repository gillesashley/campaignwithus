'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material'
import useAuth from '../../../../../hooks/useAuth'
import pointService from '../../../../../services/pointService'
import paymentService from '../../../../../services/paymentService'

const WithdrawPointsPage = () => {
  const { user, token, loading: authLoading } = useAuth()
  const [points, setPoints] = useState({ totalPoints: 0 })
  const [payments, setPayments] = useState({ totalWithdrawnPoints: 0 })
  const [loading, setLoading] = useState(true)
  const [withdrawPoints, setWithdrawPoints] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const router = useRouter()

  const MIN_POINTS_FOR_WITHDRAWAL = parseInt(process.env.NEXT_PUBLIC_MIN_POINTS_FOR_WITHDRAWAL, 10) || 20
  const POINTS_TO_CEDI_CONVERSION_RATE = parseFloat(process.env.NEXT_PUBLIC_POINTS_TO_CEDI_CONVERSION_RATE) || 0.1
  const MIN_DAYS_ON_PLATFORM = parseInt(process.env.NEXT_PUBLIC_MIN_DAYS_ON_PLATFORM, 10) || 30

  useEffect(() => {
    const fetchPointsAndPayments = async () => {
      try {
        const [pointsResponse, paymentsResponse] = await Promise.all([
          pointService.getUserPoints(user._id, token),
          paymentService.getUserPayments(token)
        ])

        if (pointsResponse.data.success) {
          setPoints(pointsResponse.data.data)
        } else {
          setSnackbarMessage(pointsResponse.data.message)
          setSnackbarSeverity('error')
          setSnackbarOpen(true)
        }

        if (paymentsResponse.data.success) {
          setPayments(paymentsResponse.data.data)
        } else {
          setSnackbarMessage(paymentsResponse.data.message)
          setSnackbarSeverity('error')
          setSnackbarOpen(true)
        }

        setPhoneNumber(user.phoneNumber || '')
      } catch (error) {
        setSnackbarMessage('Failed to fetch data')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && user && token) {
      fetchPointsAndPayments()
    }
  }, [user, token, authLoading])

  const totalPoints = points.totalPoints || 0
  const totalWithdrawn = payments.totalWithdrawnPoints || 0
  const remainingPoints = totalPoints - totalWithdrawn
  const cashValue = withdrawPoints ? withdrawPoints * POINTS_TO_CEDI_CONVERSION_RATE : 0

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleWithdraw = async () => {
    setWithdrawLoading(true)
    const accountAgeInDays = (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)

    if (accountAgeInDays < MIN_DAYS_ON_PLATFORM) {
      setSnackbarMessage(`You must be on the platform for at least ${MIN_DAYS_ON_PLATFORM} days to make a withdrawal`)
      setSnackbarSeverity('warning')
      setSnackbarOpen(true)
      setWithdrawLoading(false)
      return
    }

    if (withdrawPoints < MIN_POINTS_FOR_WITHDRAWAL) {
      setSnackbarMessage(`Minimum points for withdrawal is ${MIN_POINTS_FOR_WITHDRAWAL}`)
      setSnackbarSeverity('warning')
      setSnackbarOpen(true)
      setWithdrawLoading(false)
      return
    }

    if (withdrawPoints > remainingPoints) {
      setSnackbarMessage('Insufficient points for withdrawal')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
      setWithdrawLoading(false)
      return
    }

    try {
      const response = await paymentService.createPayment(token, {
        userId: user._id,
        pointsToWithdraw: parseInt(withdrawPoints, 10),
        phoneNumber
      })
      if (response.data.success) {
        setSnackbarMessage('Payment request created successfully')
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
        router.push('/home/point-payment') // Redirect to payment requests page or similar
      } else {
        setSnackbarMessage(response.data.message)
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      }
    } catch (error) {
      setSnackbarMessage('Failed to create payment request')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    } finally {
      setWithdrawLoading(false)
    }
  }

  if (authLoading || loading) return <CircularProgress />

  return (
    <Container>
      <Typography variant='h4' className='mb-4'>
        Withdraw Points
      </Typography>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant='h6'>Total Points Earned</Typography>
                <Typography variant='h4'>{totalPoints}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant='h6'>Total Points Withdrawn</Typography>
                <Typography variant='h4'>{totalWithdrawn}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant='h6'>Remaining Points</Typography>
                <Typography variant='h4'>{remainingPoints}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box className='mt-4' display='flex' justifyContent='center'>
          <Card sx={{ maxWidth: 400, width: '100%', padding: 2 }}>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Enter Points to Withdraw (Min: {MIN_POINTS_FOR_WITHDRAWAL})
              </Typography>
              <TextField
                fullWidth
                required
                label='Withdraw Points'
                type='number'
                value={withdrawPoints}
                onChange={e => setWithdrawPoints(e.target.value)}
                inputProps={{ min: MIN_POINTS_FOR_WITHDRAWAL, max: remainingPoints }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                label='Phone Number'
                type='text'
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Typography variant='body1' gutterBottom>
                Cash Value: GHS {cashValue.toFixed(2)}
              </Typography>
              <Button
                variant='contained'
                color='primary'
                fullWidth
                onClick={handleWithdraw}
                disabled={
                  withdrawLoading ||
                  withdrawPoints < MIN_POINTS_FOR_WITHDRAWAL ||
                  withdrawPoints > remainingPoints ||
                  phoneNumber.trim() === ''
                }
              >
                {withdrawLoading ? <CircularProgress color='secondary' size={24} /> : 'Withdraw'}
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default WithdrawPointsPage
