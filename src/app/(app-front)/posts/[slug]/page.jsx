/**
 * This file contains the PostDetailsPage component, which is responsible for rendering the detailed view of a blog post.
 * It imports necessary dependencies and components from the application.
 * It also defines the style object for the modal component.
 */

'use client'

// Import necessary components and dependencies
import { PublicPagesLayout } from '@/components/layout/public-pages-layout/PublicPagesLayout'; // Import the PublicPagesLayout component
import { BlogPostCard } from '@/components/pages/BlogPostCard'; // Import the BlogPostCard component
import useAuth from '@/hooks/useAuth'; // Import the useAuth hook for authentication
import PostsProvider from '@/providers/PostsProvider'; // Import the PostsProvider component
import pointService from '@/services/pointService'; // Import the pointService for interacting with the database
import { isoDateToShortDate } from '@/utils/dateConvertor'; // Import the isoDateToShortDate utility function
import {
  checkUserLikedPost,
  fetchPointTypes,
  fetchPointTypesCounts,
  fetchPost,
  fetchRelatedPosts
} from '@/utils/helperFunctions/postDetails'; // Import the helper functions for fetching related data

// Import necessary UI components from Material-UI
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';

// Import UI components from Material-UI
import Alert from '@mui/material/Alert'; // Import the Alert component
import Modal from '@mui/material/Modal'; // Import the Modal component
import Snackbar from '@mui/material/Snackbar'; // Import the Snackbar component
import DOMPurify from 'dompurify'; // Import the DOMPurify library for sanitizing HTML

// Import necessary navigation components from Next.js
import Link from 'next/link'; // Import the Link component
import { useEffect, useState } from 'react'; // Import the useState and useEffect hooks

// Import icons from different icon libraries
import { FaCopy, FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { HiOutlineThumbUp, HiThumbUp } from 'react-icons/hi';
import { RiShareForwardLine } from 'react-icons/ri';

// Define the style object for the modal component
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

/**
 * The PostDetailsPage component displays the details of a single post.
 * It fetches the post, related posts, and point types counts using the
 * useEffect hook. It also handles user interactions such as liking,
 * sharing, and opening a modal.
 *
 * @param {Object} query - The query object containing the post slug.
 * @return {JSX.Element} The PostDetailsPage component.
 */
const PostDetailsPage = query => {
  // State variables to store post details, loading state, point types,
  // related posts, and user interactions
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);
  const [reads, setReads] = useState(0);
  const [liked, setLiked] = useState(false);
  const [pointId, setPointId] = useState(null);
  const [pointTypesCountUpdate, setPointTypesCountUpdate] = useState(false);
  const [post, setPost] = useState(null); // State to store the fetched post
  const [loading, setLoading] = useState(true);
  const [pointTypes, setPointTypes] = useState([]);
  const { token, user } = useAuth();
  const [relatedPosts, setRelatedPosts] = useState([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [modalOpen, setModalOpen] = useState(false);

  /**
   * Closes the snackbar.
   */
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  /**
   * Opens the modal.
   */
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  /**
   * Closes the modal.
   */
  const handleModalClose = () => {
    setModalOpen(false);
  };

  /**
   * Fetches the post, related posts, and point types counts when the
   * component mounts or when the query or pointTypesCountUpdate state
   * changes.
   */
  useEffect(() => {
    const postSlug = query.params.slug;

    if (postSlug) {
      fetchPost(postSlug, setPost, setLoading, id =>
        fetchPointTypesCounts(id, setLikes, setLiked, setPointId, setShares, setReads, setPointTypesCountUpdate, user)
      );
      fetchPointTypes(setPointTypes);
      fetchRelatedPosts(postSlug, setRelatedPosts, setLoading);
      checkUserLikedPost(user, postSlug, setLiked, setPointId);
    }
  }, [query, pointTypesCountUpdate, user]);

  /**
   * Handles the action button click event.
   *
   * @param {string} action - The action to perform (like, share, etc.).
   */
  const handleActionButtonClick = async action => {
    if (!user) {
      // Show error message if user is not logged in
      setSnackbarMessage('Please log in to perform this action.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);

      return;
    }

    if (user.isAdmin) {
      // Show error message if user is an admin
      setSnackbarMessage('Admins cannot perform this action.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);

      return;
    }

    const pointType = pointTypes.find(pt => pt.action === action);
    if (!pointType) {
      // Show error message if point type is not found
      console.error(`Point type for action ${action} not found`);

      return;
    }

    /**
     * Handles the click event for the action button.
     *
     * @param {string} action - The action to perform (like, share, etc.).
     * @returns {Promise<void>} - A promise that resolves when the action is complete.
     */
    const handleActionButtonClick = async (action) => {
      const data = { userId: user._id, postId: post._id, pointTypeId: pointType._id }

      try {
        // If the post is already liked by the user, delete the like point
        if (liked) {
          await pointService.deletePoint(pointId, token)
          setSnackbarMessage('Post unliked successfully!')
          setSnackbarSeverity('success')
          setSnackbarOpen(true)
          setLikes(likes - 1)
          setLiked(false)
        } else {
          // If the post is not liked by the user, create a new point for the action
          const response = await pointService.createPoint(data, token)
          if (response.data.success) {
            setSnackbarSeverity('success')

            // Update the like count and set the liked state if the action is 'Like Post'
            if (action === 'Like Post') {
              setSnackbarMessage('Post liked successfully!')
              setSnackbarOpen(true)
              setLikes(likes + 1)
              setLiked(true)
              setPointId(response.data.data._id)
            }

            // Update the share count if the action is 'Share Post'
            if (action === 'Share Post') {
              setSnackbarMessage('Post shared successfully!')
              setSnackbarOpen(true)
              setShares(shares + 1)
            }

            // Update the read count if the action is 'Read Post'
            if (action === 'Read Post') {
              console.log('Post read successfully!')
              setReads(reads + 1)
            }
          }
        }
      } catch (error) {
        // Show an error message if there is an error performing the action
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

    // If the user is an admin, set the uniqueLink to the post's slug URL
    if (user.isAdmin) {
      uniqueLink = `${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.slug}`
    } else {
      try {
        // Find the point type associated with sharing a post
        const pointType = pointTypes.find(pt => pt.action === 'Share Post')

        // Create a data object with the user, post, and point type IDs
        const data = { userId: user._id, postId: post._id, pointTypeId: pointType._id }

        // Call the pointService to create a new point for sharing the post
        const response = await pointService.createPoint(data, token)

        // If the point creation is successful, update the uniqueLink and show a success message
        if (response.data.success) {
          uniqueLink = response.data.data.url
          setSnackbarMessage('Post link copied to clipboard!')
          setSnackbarSeverity('success')
          setShares(shares + 1)
          setSnackbarOpen(true)
        }
      } catch (error) {
        // If there's an error creating the point, show an error message
        setSnackbarMessage('Failed to copy post link.')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)

        return
      }
    }

    // Copy the unique link to the clipboard
    navigator.clipboard
      .writeText(uniqueLink)
      .then(() => {
        // Show success message if the link is copied successfully
        setSnackbarMessage('Post link copied to clipboard!')
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
      })
      .catch(error => {
        // Show error message if there's an error copying the link
        console.error('Failed to copy link:', error)
        setSnackbarMessage('Failed to copy link.')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      })
  }

  const convertHtmlToText = html => {
    const tempElement = document.createElement('div')
    tempElement.innerHTML = html

    return tempElement.textContent || tempElement.innerText || ''
  }

  // Sanitize HTML content
  const createMarkup = html => {
    // Sanitize the HTML content
    const sanitizedHtml = DOMPurify.sanitize(html)

    // Add extra space wherever there is a <p> tag
    const formattedHtml = sanitizedHtml.replace(/<\/p><p>/g, '</p><p>&nbsp;</p><p>')

    return { __html: formattedHtml }
  }

  /**
   * If the post is null and loading is false, render a "No Post found" message
   * and a button to see all campaign posts.
   *
   * @return {JSX.Element} The container with the error message and button.
   */
  if (post == null && !loading) {
    return (
      <Container maxWidth='md' sx={{ mt: 4, textAlign: 'center' }}>
        {/* Display the error message */}
        <Typography variant='h4' gutterBottom>
          No Post found.
        </Typography>
        {/* Link to see all campaign posts */}
        <Link href={'/'}>
          <Button variant='contained' color='primary'>
            See all Campaign Posts
          </Button>
        </Link>
      </Container>
    )
  }

  return (
    <PostsProvider>
      <PublicPagesLayout>
        <Container maxWidth='lg' sx={{ mt: 4 }}>
          {loading ? (
            <Box display='flex'>
              <CircularProgress />
            </Box>
          ) : (
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              {/* Image */}
              <CardMedia
                className='w-full object-cover object-center'
                component='img'
                height='400'
                image={
                  post.imageUrl ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/${post.imageUrl}` : '/images/default.jpg'
                }
                alt={post.title}
              />
              {/* <Image
                className='w-full object-cover object-center'
                component='img'
                height={400}
                width={400}
                src={post.imageUrl ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/${post.imageUrl}` : '/images/default.jpg'}
                alt={post.title}
              /> */}
              <CardContent className='px-6 '>
                <Typography variant='h3'>{post.title}</Typography>

                {/* Meta Data */}
                <Container className='post-meta flex flex-wrap gap-x-2 gap-y-1 p-0 mb-6'>
                  <Grid sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <i className='tabler-user text-[14px]' />
                    <i className='text-xs'>{post.userId?.name ? post.userId?.name : 'Unknown Author'}</i>
                  </Grid>
                  <Grid sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <i className='tabler-building text-[14px]' />
                    <i className='text-xs'>{post.constituencyId?.name ? post.constituencyId.name : 'General'}</i>
                  </Grid>
                  <Grid sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <i className='tabler-clock text-[14px]' />
                    <i className='text-xs'>{isoDateToShortDate(post.createdAt)} </i>
                  </Grid>
                  <Grid sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <i className='tabler-eye text-[14px]' />
                    <i className='text-xs'> {post.totalReadsCount} Reads</i>
                  </Grid>
                </Container>

                {/* Content */}
                <Container className=''>
                  <Typography variant='body1' className='text-justify'>
                    <Box
                      component={'div'}
                      className='text-justify'
                      dangerouslySetInnerHTML={createMarkup(post.content)}
                    />
                  </Typography>
                </Container>

                {/* Actions */}
                <Container sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Tooltip title='Like'>
                      <IconButton
                        size='small'
                        disabled={user && user.isAdmin}
                        onClick={() => handleActionButtonClick('Like Post')}
                      >
                        {liked ? <HiThumbUp size={24} /> : <HiOutlineThumbUp size={24} />} {likes}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Share'>
                      <IconButton size='small' onClick={handleModalOpen}>
                        <RiShareForwardLine size={24} /> {shares}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Container for social sharing buttons and copy link button */}
                  <Container className='flex items-center justify-end'>
                    {/* Text label for social sharing buttons */}
                    <i className='text-xs'> Share this Post: </i>
                    {/* Share on WhatsApp button */}
                    <Tooltip title='Share on WhatsApp'>
                      <IconButton onClick={() => handleShareClick('whatsapp')}>
                        <FaWhatsapp size={24} color='#25D366' />
                      </IconButton>
                    </Tooltip>
                    {/* Share on Facebook button */}
                    <Tooltip title='Share on Facebook'>
                      <IconButton onClick={() => handleShareClick('facebook')}>
                        <FaFacebook size={24} color='#1877F2' />
                      </IconButton>
                    </Tooltip>
                    {/* Share on Twitter button */}
                    <Tooltip title='Share on Twitter'>
                      <IconButton onClick={() => handleShareClick('twitter')}>
                        <FaTwitter size={24} color='#1DA1F2' />
                      </IconButton>
                    </Tooltip>
                    {/* Share on LinkedIn button */}
                    <Tooltip title='Share on LinkedIn'>
                      <IconButton onClick={() => handleShareClick('linkedin')}>
                        <FaLinkedin size={24} color='#0077B5' />
                      </IconButton>
                    </Tooltip>
                    {/* Copy link button */}
                    <Tooltip title='Copy Link'>
                      <IconButton onClick={handleCopyLink}>
                        <FaCopy size={24} />
                      </IconButton>
                    </Tooltip>
                  </Container>
                </Container>
              </CardContent>
            </Card>
          )}
        </Container>

        {/* Related Posts Section */}
        <Container className='related-posts' maxWidth='lg' sx={{ mt: 6 }}>
          <Typography variant='h3'>Related Posts</Typography>
          <Divider className='mb-6' />

          <Grid container spacing={4}>
            {relatedPosts.length > 0 ? (
              relatedPosts.map((post, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <BlogPostCard post={post} pointTypes={pointTypes} />
                </Grid>
              ))
            ) : (
              <Grid item>
                <Typography>No Related Posts Available.</Typography>
              </Grid>
            )}
          </Grid>
        </Container>

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

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
      </PublicPagesLayout>
    </PostsProvider>
  )
}

export default PostDetailsPage
