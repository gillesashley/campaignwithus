'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
  Grid,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js'
import analyticsService from '../../../../services/analyticsService'
import paymentService from '../../../../services/paymentService'
import useAuth from '../../../../hooks/useAuth'
import 'tailwindcss/tailwind.css'

// Register the necessary chart components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

const Dashboard = () => {
  const { user, token } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [paymentsOverTime, setPaymentsOverTime] = useState([])
  const [loading, setLoading] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const fetchPaymentsOverTime = async () => {
    try {
      const response = user.isAdmin
        ? await paymentService.getAdminPayments(token)
        : await paymentService.getUserPayments(token)
      if (response.data.success) {
        setPaymentsOverTime(response.data.data.payments)
      } else {
        setSnackbarMessage(response.data.message)
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      }
    } catch (error) {
      setSnackbarMessage('Failed to fetch payments over time')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response
        if (user.isAdmin) {
          response = await analyticsService.getAdminAnalytics(token)
        } else {
          response = await analyticsService.getUserAnalytics(token)
        }
        setAnalytics(response.data.data)
        await fetchPaymentsOverTime()
      } catch (error) {
        setSnackbarMessage('Failed to fetch analytics')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    if (token) {
      fetchData()
    }
  }, [token, user])

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  if (loading) return <CircularProgress />

  if (!analytics) return <div>Loading...</div>

  const paymentsLineData = {
    labels: (paymentsOverTime || []).map(pt => `${new Date(pt.createdAt).toLocaleDateString()}`),
    datasets: [
      {
        label: 'Payments Over Time',
        data: (paymentsOverTime || []).map(pt => pt.amount),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)'
      }
    ]
  }

  const userRegistrationData = {
    labels: analytics.usersByRegion ? analytics.usersByRegion.map(region => region.regionName) : [],
    datasets: [
      {
        label: 'Users by Region',
        data: analytics.usersByRegion ? analytics.usersByRegion.map(region => region.count) : [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)'
      }
    ]
  }

  return (
    <div className='p-4'>
      <div className='flex justify-between items-center'>
        <Typography variant='h4'>Campaign With Us</Typography>
      </div>

      {user.isAdmin ? (
        <>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4'>
            <Card className='p-4'>
              <Typography variant='h5' className='font-semibold'>
                Total Users
              </Typography>
              <Typography variant='h2' className='font-bold text-blue-500'>
                {analytics.totalUsers}
              </Typography>
            </Card>

            <Card className='p-4'>
              <Typography variant='h5' className='font-semibold'>
                Top Region by Users
              </Typography>
              <Typography variant='h2' className='font-bold text-orange-500'>
                {analytics.topRegion?.regionName || 'N/A'}
              </Typography>
              <Typography variant='h6' className='text-green-500'>
                {analytics.topRegion?.count || 0} Users
              </Typography>
            </Card>

            <Card className='p-4'>
              <Typography variant='h5' className='font-semibold'>
                Top Constituency by Users
              </Typography>
              <Typography variant='h2' className='font-bold text-purple-500'>
                {analytics.topConstituency?.constituencyName || 'N/A'}
              </Typography>
              <Typography variant='h6' className='text-green-500'>
                {analytics.topConstituency?.count || 0} Users
              </Typography>
            </Card>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4'>
            <Card className='col-span-2 p-4'>
              <Typography variant='h5' className='font-semibold'>
                Users by Region
              </Typography>
              <Line data={userRegistrationData} />
            </Card>

            <Card className='p-4'>
              <Typography variant='h5' className='font-semibold'>
                Top Regions by Shares
              </Typography>
              <List>
                {analytics.topRegionsByShares?.map((region, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar>{region.regionName.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={region.regionName} secondary={`${region.totalShares} shares`} />
                  </ListItem>
                ))}
              </List>
            </Card>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4`}>
            <Card className='col-span-2 p-4'>
              <Typography variant='h5' className='font-semibold'>
                Payments Over Time
              </Typography>
              <Line data={paymentsLineData} />
            </Card>

            <Card className='p-4'>
              <Typography variant='h5' className='font-semibold'>
                Top Constituencies by Shares
              </Typography>
              <List>
                {analytics.topConstituenciesByShares?.map((constituency, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar>{constituency.constituencyName.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={constituency.constituencyName}
                      secondary={`${constituency.totalShares} shares`}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>
          </div>
        </>
      ) : (
        <>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4'>
            <Card className='p-4'>
              <Typography variant='h5' className='font-semibold'>
                Total Points Built
              </Typography>
              <Typography variant='h2' className='font-bold text-blue-500'>
                {analytics.userPoints}
              </Typography>
            </Card>

            <Card className='p-4'>
              <Typography variant='h5' className='font-semibold'>
                Points Today
              </Typography>
              <Typography variant='h2' className='font-bold text-orange-500'>
                {analytics.pointsToday}
              </Typography>
            </Card>

            <Card className='p-4'>
              <Typography variant='h5' className='font-semibold'>
                Points This Month
              </Typography>
              <Typography variant='h2' className='font-bold text-purple-500'>
                {analytics.pointsThisMonth}
              </Typography>
            </Card>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4'>
            <Card className='col-span-12 p-4'>
              <Typography variant='h5' className='font-semibold'>
                Payments Over Time
              </Typography>
              <Line data={paymentsLineData} />
            </Card>
          </div>
        </>
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Dashboard
