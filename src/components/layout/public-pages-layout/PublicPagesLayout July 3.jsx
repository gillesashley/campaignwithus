// Next Imports
'use client'
import Link from 'next/link'
import useAuth from '@/hooks/useAuth'
import UserDropdown from '../shared/UserDropdown'
import {
  CircularProgress,
  TextField,
  Grid,
  Button,
  Select,
  Box,
  Typography,
  Container,
  AppBar,
  Toolbar,
  Autocomplete,
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material'
import Logo from '../shared/Logo'
import PostsProvider, { usePostsContext } from '@/providers/PostsProvider'
import { useEffect, useState } from 'react'
import { Carousel } from '@components/swiper/ReactSlick'
import bannerService from '../../../services/bannerService'
import { shuffleArray } from '@/utils/listsManipulation'
import { useParams, usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'

export const PublicPagesLayout = ({ children }) => {
  const { user, loading } = useAuth()
  const [banners, setBanners] = useState([])
  const currentPath = usePathname()

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await bannerService.getBanners()
        setBanners(shuffleArray(response.data.data))
      } catch (error) {
        console.log(error)
      }
    }

    fetchBanners()
    if (user) console.log({ user })
  }, [])
  //Log User Details

  const {
    filterAllCampaignPosts,
    filterPostsByIndustry,
    filterPostsByTrending,
    filterPostsByUserConstituency,
    constituencies,
    industries,
    activeFilter,
    handleFilterChange
  } = usePostsContext()

  const handleInputConstituency = (event, constituencyName) => {
    if (constituencyName) {
      handleFilterChange('constituency', true, constituencyName)
    } else {
      handleFilterChange('constituency', false, null)
    }
  }

  const handleInputIndustry = (event, industryName) => {
    if (industryName) {
      handleFilterChange('industry', true, industryName)
    } else {
      handleFilterChange('industry', false, null)
    }
  }

  const filterProps = {
    filterPostsByTrending,
    filterAllCampaignPosts,
    filterPostsByUserConstituency,
    handleInputConstituency,
    handleInputIndustry,
    activeFilter,
    user,
    constituencies,
    industries
  }

  return (
    <PostsProvider>
      <Box sx={{ backgroundColor: 'gray.100' }}>
        <Container maxWidth='xl' sx={{ py: 6 }}>
          <NavBar loading={loading} />

          {/* Hero Section */}
          {/* bg-[#16284f] */}
          <Container className='hero-section bg-transparent mt-8 pt-2 mb-6 '>
            {banners.length > 0 && <Carousel images={banners} />}
          </Container>

          {/* Navigation & Filter Section */}
          {/* Check if route is home page */}
          {(currentPath === '/') | (currentPath === '/posts') ? <FilterPanel {...filterProps} /> : <NavigationPanel />}

          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box
              component='aside'
              sx={{ width: '25%', display: { xs: 'none', md: 'block' }, bgcolor: 'gray.100', p: 2, borderRadius: 1 }}
            >
              Ad Content Here!
            </Box>
            <Box component='section' sx={{ width: { xs: '100%', md: '75%' } }}>
              {children}
            </Box>
          </Box>
        </Container>
      </Box>
    </PostsProvider>
  )
}

export const NavBar = ({ loading }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const { posts } = usePostsContext()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (query) {
      const filteredSuggestions = posts.filter(post => {
        const queryLower = query.toLowerCase()
        return (
          post.title.toLowerCase().includes(queryLower) ||
          post.constituencyId?.name.toLowerCase().includes(queryLower) ||
          post.industryId?.name.toLowerCase().includes(queryLower) ||
          post.userId?.name.toLowerCase().includes(queryLower)
        )
      })
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
  }, [query, posts])

  const handleSuggestionClick = slug => {
    router.push(`/posts/${slug}`)
  }

  return (
    <AppBar position='fixed' color='default' elevation={1} sx={{ zIndex: 10 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Grid item className='flex-[0.45]'>
          <Logo />
        </Grid>
        <Box className='hidden sm:flex flex-[auto] border-none rounded outline-none justify-center'>
          <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <TextField
              fullWidth
              variant='outlined'
              size='small'
              className='max-w-md'
              placeholder='Search Post, Constituency, Author, Industry...'
              value={query}
              onChange={e => setQuery(e.target.value)}
              sx={{
                px: 3,
                border: 'none',
                borderRadius: '4px',
                outline: 'none'
              }}
            />
            {suggestions.length > 0 && (
              <List
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 20,
                  bgcolor: 'background.paper',
                  border: '1px solid #ccc'
                }}
              >
                {suggestions.map((post, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton onClick={() => handleSuggestionClick(post.slug)}>
                      <ListItemText
                        primary={post.title}
                        secondary={`${post.userId?.name || 'Unknown Author'} - ${
                          post.constituencyId?.name || 'General'
                        }`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Box>
        <Grid item className='flex-[0.45] flex justify-end'>
          {loading && <CircularProgress />}
          {!loading && user && <UserDropdown />}
          {!loading && !user && (
            <Grid container spacing={2} justifyContent={'flex-end'}>
              <Grid item>
                <Button variant='contained' color='primary' href='/login'>
                  Login
                </Button>
              </Grid>
              <Grid item>
                <Button variant='contained' color='primary' href='/register'>
                  Register
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

const FilterPanel = ({
  filterPostsByTrending,
  filterAllCampaignPosts,
  filterPostsByUserConstituency,
  handleInputConstituency,
  handleInputIndustry,
  activeFilter,
  user,
  constituencies,
  industries,
  ...props
}) => {
  return (
    <Card
      sx={{
        p: 2,
        mb: 6,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 2,
        overflowX: 'auto',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
        '::-webkit-scrollbar': {
          display: 'none'
        },
        scrollSnapType: 'x mandatory'
      }}
      {...props}
    >
      <Typography variant='h6' sx={{ px: 2, flex: '0 0 auto', scrollSnapAlign: 'start' }}>
        Campaign Posts Filter
      </Typography>
      <Button
        onClick={filterPostsByTrending}
        variant={activeFilter === 'trending' ? 'contained' : 'outlined'}
        sx={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}
      >
        Trending Posts
      </Button>
      <Button
        onClick={filterAllCampaignPosts}
        variant={activeFilter === 'all' ? 'contained' : 'outlined'}
        sx={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}
      >
        All Campaign Posts
      </Button>
      {user && user.constituency._id && (
        <Button
          onClick={() => filterPostsByUserConstituency(user.constituency._id)}
          variant={activeFilter === 'user-constituency' ? 'contained' : 'outlined'}
          sx={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}
        >
          My Constituency Posts
        </Button>
      )}
      <Autocomplete
        options={constituencies}
        getOptionLabel={constituency => constituency.name}
        onInputChange={handleInputConstituency}
        renderInput={params => (
          <TextField
            {...params}
            label='Select Constituency'
            variant='outlined'
            size='small'
            sx={{ minWidth: 220, flex: '0 0 auto', scrollSnapAlign: 'start' }}
          />
        )}
      />
      <Autocomplete
        options={industries}
        getOptionLabel={industry => industry.name}
        onInputChange={handleInputIndustry}
        renderInput={params => (
          <TextField
            {...params}
            label='Select Sector/Industry'
            variant='outlined'
            size='small'
            sx={{ minWidth: 220, flex: '0 0 auto', scrollSnapAlign: 'start' }}
          />
        )}
      />
    </Card>
  )
}

const NavigationPanel = ({ ...props }) => {
  const router = useRouter()
  const currentPath = usePathname()
  const currentPathParams = useParams()

  return (
    <Card
      sx={{
        p: 2,
        mb: 6,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start', // Align items to the start
        gap: 2,
        overflowX: 'auto',
        overflowY: 'hidden',
        whiteSpace: 'nowrap', // Prevent line wrapping
        scrollbarWidth: 'none', // Hide scrollbar for Firefox
        '::-webkit-scrollbar': {
          display: 'none' // Hide scrollbar for Chrome, Safari, and Opera
        },
        scrollSnapType: 'x mandatory' // Enable scroll snapping
      }}
      {...props}
    >
      <Typography variant='h6' sx={{ px: 2, flex: '0 0 auto', scrollSnapAlign: 'start' }}>
        Navigate
      </Typography>
      <Button
        onClick={() => router.push('/')}
        variant={currentPath === '/' ? 'contained' : 'outlined'}
        sx={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}
      >
        Home
      </Button>
      <Button
        onClick={() => router.push('/posts')}
        variant={currentPath === '/posts' ? 'contained' : 'outlined'}
        sx={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}
      >
        Trending Campaign Posts
      </Button>

      {currentPath === `/posts/${currentPathParams.slug}` && (
        <Button
          variant={currentPath === `/posts/${currentPathParams.slug}` ? 'contained' : 'outlined'}
          sx={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}
        >
          Post Details
        </Button>
      )}
      <Button
        onClick={() => router.push('/about')}
        variant={currentPath === '/about' ? 'contained' : 'outlined'}
        sx={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}
      >
        About
      </Button>
    </Card>
  )
}
