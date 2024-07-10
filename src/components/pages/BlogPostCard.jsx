import React, { useEffect, useState } from 'react'
import { RiShareForwardLine } from 'react-icons/ri'
import { HiOutlineThumbUp, HiThumbUp } from 'react-icons/hi'
import Link from 'next/link'
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Snackbar,
  Alert,
  Modal,
  Tooltip,
  Divider,
  Container
} from '@mui/material'
import { FaWhatsapp, FaFacebook, FaTwitter, FaLinkedin, FaCopy } from 'react-icons/fa'
import useAuth from '@/hooks/useAuth'
import pointService from '../../services/pointService'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
}

export const BlogPostCard = ({ post, pointTypes }) => {
  const router = useRouter()
  const [likes, setLikes] = useState(0)
  const [shares, setShares] = useState(0)
  const [reads, setReads] = useState(0)
  const [liked, setLiked] = useState(false)
  const [pointId, setPointId] = useState(null)
  const [pointTypesCountUpdate, setPointTypesCountUpdate] = useState(false)
  const { token, user } = useAuth()

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const [modalOpen, setModalOpen] = useState(false)

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleModalOpen = () => {
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
  }

  const handleShareClick = async platform => {
    if (!user) {
      setSnackbarMessage('Please log in to share posts.')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
      return
    }

    let uniqueLink = ''

    if (user.isAdmin) {
      uniqueLink = `${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.slug}`
    } else {
      try {
        const pointType = pointTypes.find(pt => pt.action === 'Share Post')
        const data = { userId: user._id, postId: post._id, pointTypeId: pointType._id }
        const response = await pointService.createPoint(data, token)

        if (response.data.success) {
          uniqueLink = response.data.data.url
          console.log({ uniqueLink })
          setSnackbarMessage('Post shared successfully!')
          setSnackbarSeverity('success')
          setShares(shares + 1)
          setSnackbarOpen(true)
        }
      } catch (error) {
        setSnackbarMessage('Failed to share post.')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
        return
      }
    }

    let shareUrl = ''
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(uniqueLink)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(uniqueLink)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(uniqueLink)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(uniqueLink)}`
        break
      default:
        return
    }

    window.open(shareUrl, '_blank')
  }

  const handleCopyLink = async () => {
    if (!user) {
      setSnackbarMessage('Please log in to copy links.')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
      return
    }

    let uniqueLink = ''

    if (user.isAdmin) {
      uniqueLink = `${process.env.NEXT_PUBLIC_APP_URL}/posts/${post._id}`
    } else {
      try {
        const pointType = pointTypes.find(pt => pt.action === 'Share Post')
        const data = { userId: user._id, postId: post._id, pointTypeId: pointType._id }
        const response = await pointService.createPoint(data, token)

        if (response.data.success) {
          uniqueLink = response.data.data.url
          setShares(shares + 1)
        }
      } catch (error) {
        setSnackbarMessage('Failed to copy link.')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
        return
      }
    }

    navigator.clipboard.writeText(uniqueLink).then(() => {
      setSnackbarMessage('Link copied to clipboard!')
      setSnackbarSeverity('success')
      setSnackbarOpen(true)
    })
  }

  useEffect(() => {
    const fetchPointTypesCounts = async () => {
      try {
        const { data } = await pointService.getPostPointTypeCounts(post._id)
        data.data.forEach(pt => {
          if (pt.pointType.action === 'Like Post') {
            setLikes(pt.count)
            if (pt.users && user && pt.users.includes(user._id)) {
              setLiked(true)
              setPointId(pt._id)
            }
          }
          if (pt.pointType.action === 'Share Post') {
            setShares(pt.count)
          }
          if (pt.pointType.action === 'Read Post') {
            setReads(pt.count)
          }
        })
      } catch (error) {
        console.error(error)
      } finally {
        setPointTypesCountUpdate(false)
      }
    }

    const checkUserLikedPost = async () => {
      if (user && !user.isAdmin) {
        try {
          const { data } = await pointService.getUserPoints(user._id)
          const likedPost = data.data.points.find(
            point => point.postId._id === post._id && point.pointTypeId.action === 'Like Post'
          )
          if (likedPost) {
            setLiked(true)
            setPointId(likedPost._id)
          }
        } catch (error) {
          console.error(error)
        }
      }
    }

    fetchPointTypesCounts()
    checkUserLikedPost()
  }, [pointTypesCountUpdate, user, post._id])

  const handleActionButtonClick = async action => {
    if (!user) {
      setSnackbarMessage('Please log in to perform this action.')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
      return
    }

    if (user.isAdmin) {
      setSnackbarMessage('Admins cannot perform this action.')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
      return
    }

    const pointType = pointTypes.find(pt => pt.action === action)
    if (!pointType) {
      console.error(`Point type for action ${action} not found`)
      return
    }

    const data = { userId: user._id, postId: post._id, pointTypeId: pointType._id }
    try {
      if (liked) {
        await pointService.deletePoint(pointId, token)
        setSnackbarMessage('Post unliked successfully!')
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
        setLikes(likes - 1)
        setLiked(false)
      } else {
        const response = await pointService.createPoint(data, token)
        if (response.data.success) {
          setSnackbarSeverity('success')

          if (action === 'Like Post') {
            setSnackbarMessage('Post liked successfully!')
            setSnackbarOpen(true)
            setLikes(likes + 1)
            setLiked(true)
            setPointId(response.data.data._id)
          }
          if (action === 'Share Post') {
            setSnackbarMessage('Post shared successfully!')
            setSnackbarOpen(true)
            setShares(shares + 1)
          }
          if (action === 'Read Post') {
            console.log('Post read successfully!')
            setReads(reads + 1)
          }
        }
      }
    } catch (error) {
      setSnackbarSeverity('error')
      const errorMessage = error.response?.data?.errors?.[0]?.message || error.message
      if (errorMessage) {
        setSnackbarMessage(errorMessage)
        console.error(errorMessage)
      } else {
        console.error(`Error performing action ${action} on post:`, error)
        setSnackbarMessage(`Error performing action ${action} on post:`, error)
      }
      setSnackbarOpen(true)
    }
  }

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
      <CardMedia
        component='img'
        height='140'
        image={post.imageUrl ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/${post.imageUrl}` : '/images/default.jpg'}
        alt={post.title ? post.title : 'Post Image'}
      />

      {/* <Image
        className='w-full object-cover object-center'
        width={140}
        height={140}
        src={post.imageUrl ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/${post.imageUrl}` : '/images/default.jpg'}
        alt={post.title ? post.title : 'Post Image'}
      /> */}

      {/* Post Content */}
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

      {/* Share Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, mt: 'auto' }}>
        <IconButton
          size='small'
          className='gap-1'
          onClick={() => handleActionButtonClick('Like Post')}
          disabled={user && user.isAdmin}
        >
          {likes} {liked ? <HiThumbUp /> : <HiOutlineThumbUp />}
        </IconButton>
        <IconButton size='small' className='gap-1' onClick={handleModalOpen}>
          {shares} <RiShareForwardLine />
        </IconButton>
        <Link href={{ pathname: `/posts/${post.slug}` }}>
          <Button variant='outlined'>Read</Button>
        </Link>
      </Box>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} className='w-full'>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            {post?.title}
          </Typography>
          <Divider className='mb-3' />
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Share this post
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
            <Tooltip title='Share on WhatsApp'>
              <IconButton onClick={() => handleShareClick('whatsapp')}>
                <FaWhatsapp size={24} color='#25D366' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Share on Facebook'>
              <IconButton onClick={() => handleShareClick('facebook')}>
                <FaFacebook size={24} color='#1877F2' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Share on Twitter'>
              <IconButton onClick={() => handleShareClick('twitter')}>
                <FaTwitter size={24} color='#1DA1F2' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Share on LinkedIn'>
              <IconButton onClick={() => handleShareClick('linkedin')}>
                <FaLinkedin size={24} color='#0077B5' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Copy Link'>
              <IconButton onClick={handleCopyLink}>
                <FaCopy size={24} color='#000' />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Modal>
    </Card>
  )
}
