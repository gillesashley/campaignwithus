'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import {
  Card,
  CardHeader,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Avatar
} from '@mui/material'
import AddUserDrawer from './AddUserDrawer'
import EditUserDrawer from './EditUserDrawer'

// Service Imports
import userService from '../../../../../services/userService'

// Hook Imports
import useAuth from '../../../../../hooks/useAuth'

const UserListTable = () => {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [editUserId, setEditUserId] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [search, setSearch] = useState('')
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getUsers(token, page + 1, rowsPerPage, search)
        setUsers(response.data.data)
        setTotalUsers(response.data.count)
      } catch (error) {
        console.error('Failed to fetch users:', error)
        setSnackbarMessage('Failed to fetch users')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      } finally {
        setLoading(false)
      }
    }
    if (token) {
      setLoading(true)
      fetchUsers()
    }
  }, [token, page, rowsPerPage, search])

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearchChange = event => {
    setSearch(event.target.value)
    setPage(0)
  }

  const handleEditClick = userId => {
    setEditUserId(userId)
    setEditUserOpen(true)
  }

  const handleUserUpdated = () => {
    setEditUserOpen(false)
    setAddUserOpen(false)
    const fetchUsers = async () => {
      try {
        const response = await userService.getUsers(token, page + 1, rowsPerPage, search)
        setUsers(response.data.data)
        setTotalUsers(response.data.count)
      } catch (error) {
        console.error('Failed to fetch users:', error)
        setSnackbarMessage('Failed to fetch users')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      }
    }
    if (token) {
      fetchUsers()
    }
  }

  return (
    <>
      <Card>
        <CardHeader title='Users' />
        <div className='flex flex-wrap justify-between items-center p-4'>
          <Button variant='contained' onClick={() => setAddUserOpen(true)}>
            Add New User
          </Button>
          <TextField
            label='Search'
            variant='outlined'
            value={search}
            onChange={handleSearchChange}
            className='max-w-xs w-full md:w-1/3 mt-2 md:mt-0'
          />
        </div>
        {loading ? (
          <Box display='flex' justifyContent='center' alignItems='center' height='200px'>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Box display='flex' justifyContent='center' alignItems='center' height='200px'>
            <Typography variant='h6'>No User(s) found</Typography>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Region</TableCell>
                    <TableCell>Constituency</TableCell>
                    <TableCell>User Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className='flex items-center'>
                          <Avatar src={`${process.env.NEXT_PUBLIC_BASE_API_URL}/${user.imageUrl}`} alt={user.name} />
                          <span className='ml-2'>{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>{user.region?.name}</TableCell>
                      <TableCell>{user.constituency?.name}</TableCell>
                      <TableCell>{user.isAdmin ? 'Admin' : 'User'}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(user._id)}>
                          <i className='tabler-edit' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component='div'
              count={totalUsers}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </>
        )}
      </Card>
      <AddUserDrawer open={addUserOpen} handleClose={() => setAddUserOpen(false)} onUserAdded={handleUserUpdated} />
      <EditUserDrawer
        open={editUserOpen}
        handleClose={() => setEditUserOpen(false)}
        userId={editUserId}
        onUserUpdated={handleUserUpdated}
      />
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default UserListTable
