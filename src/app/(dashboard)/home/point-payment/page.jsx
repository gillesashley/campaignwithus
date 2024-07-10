'use client'

import React, { useState, useEffect } from 'react'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

import {
  Box,
  Container,
  Typography,
  Tab,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TablePagination,
  Grid,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  Chip
} from '@mui/material'
import CustomTabList from '@core/components/mui/TabList'
import useAuth from '../../../../hooks/useAuth'
import pointService from '../../../../services/pointService'
import paymentService from '../../../../services/paymentService'
import { Line } from 'react-chartjs-2'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { useRouter } from 'next/navigation'

// Register the necessary components for Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const PointsPaymentsPage = () => {
  const { user, token, loading: authLoading } = useAuth()
  const [value, setValue] = useState('points')
  const [points, setPoints] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [approveLoading, setApproveLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const router = useRouter()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = user.isAdmin
          ? await pointService.getAdminPoints(user._id, token)
          : await pointService.getUserPoints(user._id, token)
        if (response.data.success) {
          setPoints(response.data.data)
        } else {
          setSnackbarMessage(response.data.message)
          setSnackbarSeverity('error')
          setSnackbarOpen(true)
        }
      } catch (error) {
        setSnackbarMessage('Failed to fetch points')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      }
    }

    const fetchPayments = async () => {
      try {
        const response = user.isAdmin
          ? await paymentService.getAdminPayments(token)
          : await paymentService.getUserPayments(token)
        if (response.data.success) {
          setPayments(response.data.data)
        } else {
          setSnackbarMessage(response.data.message)
          setSnackbarSeverity('error')
          setSnackbarOpen(true)
        }
      } catch (error) {
        setSnackbarMessage('Failed to fetch payments')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      }
    }

    if (!authLoading && user && token) {
      setLoading(true)
      Promise.all([fetchPoints(), fetchPayments()]).finally(() => setLoading(false))
    }
  }, [user, token, authLoading])

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleWithdrawClick = () => {
    router.push('/home/point-payment/withdraw')
  }

  const handleApprovePayment = async paymentId => {
    setApproveLoading(true)
    try {
      const payment = payments.payments.find(payment => payment._id === paymentId)
      const response = await paymentService.updatePaymentStatus(paymentId, 'approved', token, payment.pointsWithdrawn)
      if (response.data.success) {
        setSnackbarMessage('Payment approved successfully')
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
        setPayments({
          ...payments,
          payments: payments.payments.map(payment =>
            payment._id === paymentId ? { ...payment, status: 'approved' } : payment
          )
        })
      } else {
        setSnackbarMessage(response.data.message)
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      }
    } catch (error) {
      setSnackbarMessage('Failed to approve payment')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    } finally {
      setApproveLoading(false)
    }
  }

  const handleRejectPayment = async paymentId => {
    setApproveLoading(true)
    try {
      const payment = payments.payments.find(payment => payment._id === paymentId)
      const response = await paymentService.updatePaymentStatus(paymentId, 'failed', token, payment.pointsWithdrawn)
      if (response.data.success) {
        setSnackbarMessage('Payment rejected successfully')
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
        setPayments({
          ...payments,
          payments: payments.payments.map(payment =>
            payment._id === paymentId ? { ...payment, status: 'failed' } : payment
          )
        })
      } else {
        setSnackbarMessage(response.data.message)
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      }
    } catch (error) {
      setSnackbarMessage('Failed to reject payment')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    } finally {
      setApproveLoading(false)
    }
  }

  if (authLoading || loading) {
    return <CircularProgress />
  }

  return (
    <Container>
      <Typography variant='h4' className='mb-4'>
        Points and Payments
      </Typography>
      <TabContext value={value}>
        <CustomTabList onChange={handleChange} aria-label='points and payments tabs'>
          <Tab value='points' label='Points' />
          <Tab value='payments' label='Payments' />
        </CustomTabList>
        <TabPanel value='points'>
          {user.isAdmin ? (
            <AdminPointsTable
              points={points}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          ) : (
            <UserPointsSummary
              points={points.points}
              totalPoints={points.totalPoints}
              totalWithdrawn={payments.totalWithdrawnPoints}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleWithdrawClick={handleWithdrawClick}
            />
          )}
        </TabPanel>
        <TabPanel value='payments'>
          {user.isAdmin ? (
            <AdminPaymentsTable
              payments={payments.payments}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              onApprovePayment={handleApprovePayment}
              onRejectPayment={handleRejectPayment}
              approveLoading={approveLoading}
            />
          ) : (
            <UserPaymentsSummary
              payments={payments.payments}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          )}
        </TabPanel>
      </TabContext>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

const AdminPointsTable = ({ points, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Post</TableCell>
          <TableCell>User</TableCell>
          <TableCell>Point Type</TableCell>
          <TableCell>Points</TableCell>
          <TableCell>Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {points &&
          points.length > 0 &&
          points.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(point => (
            <TableRow key={point._id}>
              <TableCell>{point.postId.title}</TableCell>
              <TableCell>{point.userId.name}</TableCell>
              <TableCell>{point.pointTypeId.action}</TableCell>
              <TableCell>{point.points}</TableCell>
              <TableCell>{new Date(point.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
    <TablePagination
      rowsPerPageOptions={[5, 10, 25, 50]}
      component='div'
      count={points ? points.length : 0}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </TableContainer>
)

const UserPointsSummary = ({
  points,
  totalPoints,
  totalWithdrawn,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleWithdrawClick
}) => {
  const remainingPoints = totalPoints - totalWithdrawn
  const cashValue = remainingPoints * (process.env.NEXT_PUBLIC_POINTS_TO_CEDI_CONVERSION_RATE || 0.1)

  return (
    <Box>
      <Button variant='contained' className='mt-4 mb-4' onClick={handleWithdrawClick}>
        Withdraw Points
      </Button>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant='h6'>Total Points Earned</Typography>
              <Typography variant='h4'>{totalPoints}</Typography>
              <Typography variant='body2'>
                Cash Value: GHS{' '}
                {(totalPoints * (process.env.NEXT_PUBLIC_POINTS_TO_CEDI_CONVERSION_RATE || 0.1)).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant='h6'>Total Points Withdrawn</Typography>
              <Typography variant='h4'>{totalWithdrawn}</Typography>
              <Typography variant='body2'>
                Cash Value: GHS{' '}
                {(totalWithdrawn * (process.env.NEXT_PUBLIC_POINTS_TO_CEDI_CONVERSION_RATE || 0.1)).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant='h6'>Remaining Points</Typography>
              <Typography variant='h4'>{remainingPoints}</Typography>
              <Typography variant='body2'>Cash Value: GHS {cashValue.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box className='mt-4'>
        <Typography variant='h6'>Points History</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Post</TableCell>
                <TableCell>Points</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {points &&
                points.length > 0 &&
                points.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(point => (
                  <TableRow key={point._id}>
                    <TableCell>{point.postId.title}</TableCell>
                    <TableCell>{point.points}</TableCell>
                    <TableCell>{new Date(point.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component='div'
            count={points ? points.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </Box>
  )
}

const AdminPaymentsTable = ({
  payments,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  onApprovePayment,
  onRejectPayment,
  approveLoading
}) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>User</TableCell>
          <TableCell>Amount (GHS)</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {payments &&
          payments.length > 0 &&
          payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(payment => (
            <TableRow key={payment._id}>
              <TableCell>{payment.userId.name}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Chip
                  label={payment.status}
                  color={
                    payment.status === 'pending'
                      ? 'warning'
                      : payment.status === 'approved'
                        ? 'primary'
                        : payment.status === 'completed'
                          ? 'success'
                          : 'error'
                  }
                  size='small'
                  variant='outlined'
                  className='rounded-full'
                />
              </TableCell>
              <TableCell>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => onApprovePayment(payment._id)}
                    disabled={approveLoading || payment.status !== 'pending'}
                    style={{ opacity: payment.status !== 'pending' ? 0.5 : 1 }}
                  >
                    {approveLoading ? 'Approving...' : 'Approve'}
                  </Button>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => onRejectPayment(payment._id)}
                    disabled={approveLoading || payment.status !== 'pending'}
                    style={{ opacity: payment.status !== 'pending' ? 0.5 : 1 }}
                  >
                    {approveLoading ? 'Rejecting...' : 'Reject'}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
    <TablePagination
      rowsPerPageOptions={[5, 10, 25, 50]}
      component='div'
      count={payments ? payments.length : 0}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </TableContainer>
)

const UserPaymentsSummary = ({ payments, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage }) => {
  const totalPayments = payments ? payments.reduce((acc, payment) => acc + payment.amount, 0) : 0

  const lineData = {
    labels: payments.map(payment => new Date(payment.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Payments Over Time',
        data: payments.map(payment => payment.amount),
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant='h6'>Total Payments</Typography>
          <Card className='mb-4'>
            <CardContent>
              <Typography variant='h6'>Total Payment</Typography>
              <Typography variant='h4'>GHS {totalPayments}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant='h6'>Payments Over Time</Typography>
              <Line data={lineData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant='h6'>Payment History</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Amount (GHS)</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments &&
                  payments.length > 0 &&
                  payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(payment => (
                    <TableRow key={payment._id}>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          color={
                            payment.status === 'pending'
                              ? 'warning'
                              : payment.status === 'approved'
                                ? 'primary'
                                : payment.status === 'completed'
                                  ? 'success'
                                  : 'error'
                          }
                          size='small'
                          variant='outlined'
                          className='rounded-full'
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component='div'
              count={payments ? payments.length : 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PointsPaymentsPage
