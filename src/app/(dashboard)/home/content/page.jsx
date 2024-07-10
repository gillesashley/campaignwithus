'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

// MUI components and icons
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableContainer,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  TableSortLabel,
  Tooltip,
  Divider
} from '@mui/material'

import { Add, Edit } from '@mui/icons-material'

// Services and hooks
import postService from '../../../../services/postService'
import useAuth from '../../../../hooks/useAuth'
import Image from 'next/image'

const truncateText = (text, length) => {
  const strippedText = text.replace(/(<([^>]+)>)/gi, '') // Strip HTML tags
  return strippedText.length > length ? `${strippedText.substring(0, length)}...` : strippedText
}

const ContentPage = () => {
  const { user, token } = useAuth()
  const [viewType, setViewType] = useState('cards')
  const [campaignPosts, setCampaignPosts] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('error')
  const [loading, setLoading] = useState(true)
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

  useEffect(() => {
    if (user && user._id) {
      const fetchPosts = async () => {
        try {
          const response = await postService.getPosts({
            userId: user._id
          })
          if (response.data.data.length === 0) {
            setSnackbarMessage('No posts found.')
            setSnackbarSeverity('info')
            setSnackbarOpen(true)
          }
          setCampaignPosts(response.data.data)
        } catch (error) {
          setSnackbarMessage('Failed to fetch campaign posts')
          setSnackbarSeverity('error')
          setSnackbarOpen(true)
          console.error('Failed to fetch campaign posts:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchPosts()
    }
  }, [user])

  const toggleView = () => {
    setViewType(viewType === 'cards' ? 'table' : 'cards')
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const showCampaignPosts = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )
    }

    if (campaignPosts.length === 0) {
      return (
        <Typography variant='h6' sx={{ mt: 4, textAlign: 'center' }}>
          No posts created yet.
        </Typography>
      )
    }

    const sortedPosts = [...campaignPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    if (viewType === 'cards') {
      return (
        <Grid container spacing={4}>
          {sortedPosts.map(post => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <ContentBlogPostCard post={post} isMobile={isMobile} />
            </Grid>
          ))}
        </Grid>
      )
    } else {
      return <CampaignTable campaignPosts={sortedPosts} isMobile={isMobile} />
    }
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap' }}>
        <Typography variant='h4' sx={{ flexGrow: 1, textAlign: isMobile ? 'center' : 'left' }}>
          Your Campaign Posts
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-end' }}>
          <Button variant='outlined' onClick={toggleView}>
            {viewType === 'cards' ? 'Switch to Table View' : 'Switch to Card View'}
          </Button>
          <Link href='/home/content/new-post' passHref>
            <Button variant='contained' startIcon={<Add />}>
              Create New Campaign Post
            </Button>
          </Link>
        </Box>
      </Box>
      {showCampaignPosts()}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

const ContentBlogPostCard = ({ post, isMobile }) => {
  const convertHtmlToText = html => {
    const tempElement = document.createElement('div')
    tempElement.innerHTML = html
    return tempElement.textContent || tempElement.innerText || ''
  }
  const contentSnippet =
    convertHtmlToText(post.content).length > 100
      ? `${convertHtmlToText(post.content).slice(
          0,
          convertHtmlToText(post.content).substring(0, 100).lastIndexOf(' ')
        )} ...`
      : convertHtmlToText(post.content)

  const titleSnippet =
    post.title?.length > 50 ? `${post.title.slice(0, post.title.substring(0, 75).lastIndexOf(' '))}...` : post.title

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Image
        className='w-full object-cover object-center'
        width={140}
        height={140}
        src={post.imageUrl ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/${post.imageUrl}` : '/images/default.jpg'}
        alt={post.title ? post.title : 'Post Image'}
      />
      <CardContent className='p-2'>
        <Tooltip title={post.title}>
          <Typography variant='h5'>{titleSnippet}</Typography>
        </Tooltip>
        <Container className='p-0 flex justify-start gap-1'>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            {/* <i className='tabler-user text-[14px]' /> */}
            {/* <i className='text-[10px]'>By: {post.userId?.name ? post.userId?.name : 'Unknown Author'} |</i> */}
            <i className='text-[10px]'>{post.regionId?.name ? `${post.regionId?.name} | ` : ''} </i>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
            <i className='text-[10px]'>{post.constituencyId?.name ? post.constituencyId?.name : 'General'}</i>
          </Box>
        </Container>
        <Divider className='mb-2' />
        <Typography variant='body2' color='text.secondary'>
          {contentSnippet}
        </Typography>
      </CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Link href={`/posts/${post._id}`} passHref>
          <Button variant='outlined' sx={{ mr: 1 }}>
            Read
          </Button>
        </Link>
        <Link href={`/home/content/edit-post/${post._id}`} passHref>
          <Button variant='outlined' startIcon={<Edit />}>
            Edit Post
          </Button>
        </Link>
      </Box>
    </Card>
  )
}

const CampaignTable = ({ campaignPosts, isMobile }) => {
  const [orderBy, setOrderBy] = useState(null)
  const [order, setOrder] = useState('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleSort = column => {
    if (orderBy === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setOrderBy(column)
      setOrder('asc')
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const sortedPosts = campaignPosts.sort((a, b) => {
    if (orderBy === null) {
      return 0
    }

    let comparison = 0
    if (orderBy === 'title') {
      comparison = a.title.localeCompare(b.title)
    } else if (orderBy === 'content') {
      comparison = a.content.localeCompare(b.content)
    } else if (orderBy === 'dateCreated') {
      comparison = new Date(a.createdAt) - new Date(b.createdAt)
    } else if (orderBy === 'constituencyId') {
      comparison = (a.constituencyId?.name || '').localeCompare(b.constituencyId?.name || '')
    } else if (orderBy === 'regionId') {
      comparison = (a.regionId?.name || '').localeCompare(b.regionId?.name || '')
    } else if (orderBy === 'industryId') {
      comparison = (a.industryId?.name || '').localeCompare(b.industryId?.name || '')
    }

    return order === 'asc' ? comparison : -comparison
  })

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel active={orderBy === 'title'} direction={order} onClick={() => handleSort('title')}>
                Title
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel active={orderBy === 'content'} direction={order} onClick={() => handleSort('content')}>
                Content
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'dateCreated'}
                direction={order}
                onClick={() => handleSort('dateCreated')}
              >
                Date Created
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'constituencyId'}
                direction={order}
                onClick={() => handleSort('constituencyId')}
              >
                Constituency
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel active={orderBy === 'regionId'} direction={order} onClick={() => handleSort('regionId')}>
                Region
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'industryId'}
                direction={order}
                onClick={() => handleSort('industryId')}
              >
                Industry
              </TableSortLabel>
            </TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(post => (
            <TableRow key={post._id} hover>
              <TableCell>{post.title}</TableCell>
              <TableCell>{truncateText(post.content, isMobile ? 50 : 100)}</TableCell>
              <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{post.constituencyId?.name || 'N/A'}</TableCell>
              <TableCell>{post.regionId?.name || 'N/A'}</TableCell>
              <TableCell>{post.industryId?.name || 'N/A'}</TableCell>
              <TableCell>
                <Link href={`/home/content/edit-post/${post._id}`} passHref>
                  <IconButton>
                    <Edit />
                  </IconButton>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component='div'
        count={campaignPosts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  )
}

export default ContentPage
