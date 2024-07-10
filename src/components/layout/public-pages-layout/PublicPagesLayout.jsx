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
import { useEffect, useRef, useState } from 'react'
import { Carousel } from '@components/swiper/ReactSlick'
import bannerService from '../../../services/bannerService'
import { shuffleArray } from '@/utils/listsManipulation'
import { useParams, usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import select from '@/@core/theme/overrides/select'

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
  }, [])
  //Log User Details

  const {
    filterAllCampaignPosts,
    filterPostsByIndustry,
    filterPostsByTrending,
    filterPostsByUserConstituency,
    filterPostsByUserRegion,
    constituencies,
    regions,
    industries,
    activeFilter,
    handleFilterChange,
    setPostsFilterTitle,
    loadingConstituencies
  } = usePostsContext()

  const handleInputConstituency = selectedConstituency => {
    if (selectedConstituency) {
      handleFilterChange('constituency', true, selectedConstituency)
    } else {
      console.log('Constituency is set null currently')
      handleFilterChange('constituency', false, null)
    }
  }

  const handleInputIndustry = selectedIndustry => {
    if (selectedIndustry) {
      handleFilterChange('industry', true, selectedIndustry)
    } else {
      handleFilterChange('industry', false, null)
    }
  }

  const handleInputRegion = selectedRegion => {
    // Clear the constituency filter

    if (selectedRegion) {
      handleFilterChange('region', true, selectedRegion)
    } else {
      handleFilterChange('region', false, null)
    }
  }

  const filterProps = {
    filterPostsByTrending,
    filterAllCampaignPosts,
    filterPostsByUserConstituency,
    filterPostsByUserRegion,
    handleInputConstituency,
    handleInputIndustry,
    handleInputRegion,
    activeFilter,
    user,
    constituencies,
    regions,
    industries,
    setPostsFilterTitle,
    loadingConstituencies
  }

  return (
    <PostsProvider>
      <Box sx={{ backgroundColor: 'gray.100' }}>
        <Container maxWidth='xl' sx={{ py: 6 }}>
          <NavBar loading={loading} />

          {/* Hero Section */}
          {/* bg-[#16284f] */}
          <Card className='hero-section bg-transparent mt-8 pt-2 mb-6 '>
            {banners.length > 0 && <Carousel images={banners} />}
          </Card>

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
    <AppBar className='min-h-16' position='fixed' color='default' elevation={1} sx={{ zIndex: 15 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Grid item className='flex-[0.5]'>
          <Logo />
        </Grid>
        <Box className='hidden sm:flex flex-[1] border-none rounded outline-none justify-center'>
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
        <Grid item className='flex-[0.5] flex justify-end'>
          {loading && <CircularProgress />}
          {!loading && user && <UserDropdown />}
          {!loading && !user && (
            <Grid container spacing={2} justifyContent={'flex-end'} flexWrap={'nowrap'}>
              <Grid item>
                <Button size='small' variant='contained' color='primary' href='/login'>
                  Login
                </Button>
              </Grid>
              <Grid item>
                <Button size='small' variant='contained' color='primary' href='/register'>
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
  filterPostsByUserRegion,
  handleInputConstituency,
  handleInputRegion,
  handleInputIndustry,
  activeFilter,
  user,
  constituencies,
  regions,
  industries,
  setPostsFilterTitle,
  loadingConstituencies,

  ...props
}) => {
  const [constituency, setConstituency] = useState(null)
  const [region, setRegion] = useState(null)
  const [industry, setIndustry] = useState(null)

  const handleSelectRegion = selectedRegion => {
    setConstituency(null)
    setRegion(selectedRegion)
    setPostsFilterTitle(prev => ({ ...prev, region: selectedRegion?.name, constituency: null, trending: false }))
    handleInputConstituency(constituency)
    handleInputRegion(selectedRegion)
  }

  const handleSelectConstituency = selectedConstituency => {
    setConstituency(selectedConstituency)
    // setPostsFilterTitle(selectedConstituency ? `${selectedConstituency.name} Constituency` : null)
    setPostsFilterTitle(prev => ({ ...prev, constituency: selectedConstituency?.name, trending: false }))

    handleInputConstituency(selectedConstituency)
  }

  const handleSelectIndustry = selectedIndustry => {
    setIndustry(selectedIndustry)
    setPostsFilterTitle(prev => ({ ...prev, industry: selectedIndustry?.name, trending: false }))
    handleInputIndustry(selectedIndustry)
  }

  const handleButtonClickFilter = type => {
    setConstituency(null)
    setIndustry(null)
    setRegion(null)
    if (type == 'trending') {
      setPostsFilterTitle(prev => ({ ...prev, trending: true, constituency: null, region: null }))
      filterPostsByTrending()
    }
    if (type == 'all') {
      setPostsFilterTitle(prev => ({ ...prev, trending: false, constituency: null, region: null }))
      filterAllCampaignPosts()
    }
  }

  const handleButtonClickUserConstituencyFilter = userConstituency => {
    setPostsFilterTitle(prev => ({ ...prev, constituency: userConstituency?.name, region: null, trending: false }))
    setConstituency(null)
    setIndustry(null)
    setRegion(null)
    // setPostsFilterTitle(`${userConstituency.name} Constituency`)
    filterPostsByUserConstituency(userConstituency._id)
  }

  const handleButtonClickUserRegionFilter = userRegion => {
    setPostsFilterTitle(prev => ({ ...prev, region: userRegion?.name, constituency: null, trending: false }))
    setConstituency(null)
    setIndustry(null)
    setRegion(null)
    // setPostsFilterTitle(`${userRegion.name} Region`)
    filterPostsByUserRegion(userRegion._id)
  }

  return (
    <Card
      className='sticky top-[64px] z-10 mx-auto'
      sx={{
        p: 2,
        mb: 6,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'stretch',
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
        Filter:
      </Typography>
      <Button
        onClick={() => handleButtonClickFilter('trending')}
        variant={activeFilter === 'trending' ? 'contained' : 'outlined'}
        sx={{ minWidth: 150, flex: '1 0 auto', scrollSnapAlign: 'center' }}
      >
        Trending Posts
      </Button>
      <Button
        onClick={() => handleButtonClickFilter('all')}
        variant={activeFilter === 'all' ? 'contained' : 'outlined'}
        sx={{ minWidth: 150, flex: '1 0 auto', scrollSnapAlign: 'center' }}
      >
        All Campaign Posts
      </Button>
      <Button
        onClick={() => handleButtonClickUserConstituencyFilter(user.constituency)}
        variant={activeFilter === 'user-constituency' ? 'contained' : 'outlined'}
        sx={{ minWidth: 150, flex: '1 0 auto', scrollSnapAlign: 'center' }}
        disabled={!user?.constituency?._id}
      >
        My Constituency Posts
      </Button>
      <Button
        onClick={() => handleButtonClickUserRegionFilter(user.region)}
        variant={activeFilter === 'user-region' ? 'contained' : 'outlined'}
        sx={{ minWidth: 150, flex: '1 0 auto', scrollSnapAlign: 'center' }}
        disabled={!user?.region?._id}
      >
        My Region Posts
      </Button>
      <Autocomplete
        options={regions}
        getOptionLabel={region => region.name}
        onChange={(e, selectedRegion) => handleSelectRegion(selectedRegion)}
        value={region}
        renderInput={params => (
          <TextField
            {...params}
            label='Select Region'
            variant='outlined'
            size='small'
            sx={{ minWidth: 150, flex: '1 0 auto', scrollSnapAlign: 'center' }}
          />
        )}
      />
      <Autocomplete
        options={constituencies}
        disabled={loadingConstituencies}
        value={constituency}
        getOptionLabel={constituency => constituency.name}
        onChange={(e, selectedConstituency) => handleSelectConstituency(selectedConstituency)}
        renderInput={params => (
          <TextField
            {...params}
            label='Select Constituency'
            variant='outlined'
            size='small'
            sx={{ minWidth: 200, flex: '1 0 auto', scrollSnapAlign: 'center' }}
          />
        )}
      />
      <Autocomplete
        options={industries}
        getOptionLabel={industry => industry.name}
        onChange={(e, selectedIndustry) => handleSelectIndustry(selectedIndustry)}
        value={industry}
        renderInput={params => (
          <TextField
            {...params}
            label='Select Sector/Industry'
            variant='outlined'
            size='small'
            sx={{ minWidth: 200, flex: '1 0 auto', scrollSnapAlign: 'center' }}
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
      className='sticky top-[64px] z-10  mx-auto'
      // className='w-fit mx-auto'
      sx={{
        p: 2,
        mb: 6,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // Align items to the start
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
        sx={{ minWidth: 150, flex: '1 0 auto', scrollSnapAlign: 'start' }}
      >
        Home
      </Button>

      {currentPath === `/posts/${currentPathParams.slug}` && (
        <Button
          variant={currentPath === `/posts/${currentPathParams.slug}` ? 'contained' : 'outlined'}
          sx={{ minWidth: 150, flex: '1 0 auto', scrollSnapAlign: 'start' }}
        >
          Post Details
        </Button>
      )}
      <Button
        onClick={() => router.push('/posts')}
        variant={currentPath === '/posts' ? 'contained' : 'outlined'}
        sx={{ minWidth: 150, flex: '1 0 auto', scrollSnapAlign: 'start' }}
      >
        Trending Campaign Posts
      </Button>
      <Button
        onClick={() => router.push('/about')}
        variant={currentPath === '/about' ? 'contained' : 'outlined'}
        sx={{ minWidth: 150, flex: '1 0 auto', scrollSnapAlign: 'start' }}
      >
        About
      </Button>
    </Card>
  )
}
