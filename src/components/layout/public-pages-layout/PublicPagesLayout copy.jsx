// Next Imports
'use client'
import Link from 'next/link'
import useAuth from '@/hooks/useAuth'
import UserDropdown from '../shared/UserDropdown'
import { SettingsProvider } from '@/@core/contexts/settingsContext'
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputBase,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  Toolbar,
  Typography
} from '@mui/material'
import { useState } from 'react'
import Logo from '../shared/Logo'

// export const PublicPagesLayout = ({ children }) => {
//   const { user, loading } = useAuth()

//   return (
//     <SettingsProvider>
//       <div className='bg-gray-100'>
//         <div className='min-h-screen bg-gray-100 p-6  mx-auto w-full'>
//           <header className='fixed top-0 left-0 w-full bg-white p-4 shadow-md z-10'>
//             <div className='max-w-screen-lg mx-auto flex items-center justify-between'>
//               <Link href='/' className='text-2xl font-bold'>
//                 <span id='logo'></span>
//                 <span>Affiliate Campaign</span>
//               </Link>
//               <input
//                 type='text'
//                 placeholder='Search constituency, message, post...'
//                 className=' flex-grow mx-4 px-4 py-3 border bg-gray-100 border-none rounded placeholder:text-blue-500  outline-none'
//               />

//               {loading && <CircularProgress />}
//               {!loading && user && (
//                 <div className='flex items-center gap-4'>
//                   <UserDropdown />
//                 </div>
//               )}

//               {!loading && !user && (
//                 <div className='flex gap-4'>
//                   <HomeButton text={'Login'} href={'/login'} />
//                   <HomeButton text={'Register'} href={'/register'} />
//                 </div>
//               )}
//             </div>
//           </header>

//           <section id='hero' className='rounded flex  text-center bg-[#16284f] text-white  shadow-md my-6'>
//             <div className='max-w-screen-md mx-auto flex items-center justify-between'>
//               <div className='flex-1  h-full '>
//                 <img
//                   id='main-photo'
//                   src='/images/general/Dr-Bawumia.png'
//                   alt='Main Banner'
//                   className='h-96 object-cover object-top rounded-lg'
//                 />
//               </div>

//               <div id='campaign-theme' className='flex-1 font-bold flex justify-center flex-col p-4'>
//                 <h3 className='text-left'>
//                   <em>IT IS</em>
//                 </h3>
//                 <h2 className='text-left p-4  sm:text-4xl md:text-5xl lg:text-6xl'>
//                   <em>POSSIBLE!</em>
//                 </h2>
//               </div>
//             </div>
//           </section>

//           <section
//             id='posts-filter'
//             className='max-w-screen-lg mx-auto flex items-center  overflow-hidden overflow-x-auto p-4 bg-white mb-6 gap-3  justify-between'
//           >
//             <h4 className='whitespace-nowrap'>Campaign Posts Filter</h4>
//             <FilterButton text={'Trending Posts'} />
//             <FilterButton text={'All Campaign Posts'} />
//             <FilterButton text={'My Constituency Posts'} />
//             <FilterButton text={'Trending Posts'} />
//             <select className='whitespace-nowrap px-4 py-2 border border-blue-500 bg-white text-blue-500 rounded hover:bg-blue-500 hover:cursor-pointer hover:text-white'>
//               <option>Select Constituency</option>
//               {/* Add options here */}
//             </select>
//             <select className='whitespace-nowrap px-4 py-2 border border-blue-500 bg-white text-blue-500 rounded hover:bg-blue-500 hover:cursor-pointer hover:text-white'>
//               <option>Select Sector / Industry</option>
//               {/* Add options here */}
//             </select>
//           </section>

//           <main className='flex max-w-screen-lg mx-auto'>
//             <aside id='ads' className='w-1/4 hidden md:block bg-gray-100 p-4'>
//               {/* Add Content */}
//               Ad Content Here!
//             </aside>
//             <section id='main-content' className='w-full md:w-3/4 p-4'>
//               {children}
//             </section>
//           </main>
//         </div>
//       </div>
//     </SettingsProvider>
//   )
// }

export const PublicPagesLayout = ({ children }) => {
  const { user, loading } = useAuth()

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedConstituency, setSelectedConstituency] = useState('')

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleConstituencySelect = constituency => {
    setSelectedConstituency(constituency)
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const constituencies = ['Constituency A', 'Constituency B', 'Constituency C'] // Add your constituencies here

  return (
    <Container maxWidth='lg'>
      {/* <header className='fixed top-0 left-0 w-full bg-white p-4 shadow-md z-10'>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item>
            <Link href='/' variant='h4'>
              <Logo />
            </Link>
          </Grid>
          <Grid item>
            <input
              type='text'
              placeholder='Search constituency, message, post...'
              className='flex-grow mx-4 px-4 py-3 border bg-gray-100 border-none rounded placeholder-blue-500 outline-none'
            />
            {loading && <CircularProgress />}
            {!loading && user && <UserDropdown />}
            {!loading && !user && (
              <Grid container spacing={4}>
                <Grid item>
                  <HomeButton text={'Login'} href={'/login'} />
                </Grid>
                <Grid item>
                  <HomeButton text={'Register'} href={'/register'} />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </header> */}
      <Header loading={loading} user={user} />

      {/* Hero Section */}
      <Paper square elevation={3} className='rounded flex text-center bg-[#16284f] text-white shadow-md my-6'>
        <Container>
          <Grid container alignItems='center' justifyContent='space-between'>
            <Grid item xs={12} sm={6}>
              <img
                id='main-photo'
                src='/images/general/Dr-Bawumia.png'
                alt='Main Banner'
                className='h-96 object-cover object-top rounded-lg'
              />
            </Grid>
            <Grid item xs={12} sm={6} className='font-bold flex justify-center flex-col p-4'>
              <Typography variant='h3' align='left'>
                <em>IT IS</em>
              </Typography>
              <Typography variant='h2' align='left' className='p-4 sm:text-4xl md:text-5xl lg:text-6xl'>
                <em>POSSIBLE!</em>
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Posts Filter Section */}
      <Container className='mb-4'>
        <Grid container className='flex items-center gap-5'>
          <Typography variant='h6' className='whitespace-nowrap'>
            Campaign Posts Filter
          </Typography>
          <Button variant='outlined'>Trending Posts</Button>
          <Button variant='outlined'>All Campaign Posts</Button>
          <Button variant='outlined'>My Constituency Posts</Button>

          <Button
            variant='outlined'
            onClick={handleClick}
            endIcon={
              <span role='img' aria-label='select-icon'>
                ▼
              </span>
            }
          >
            {selectedConstituency || 'Select Constituency'}
          </Button>

          <Button
            variant='outlined'
            onClick={handleClick}
            endIcon={
              <span role='img' aria-label='select-icon'>
                ▼
              </span>
            }
          >
            {selectedConstituency || 'Select Industry'}
          </Button>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            {constituencies.map(constituency => (
              <MenuItem key={constituency} onClick={() => handleConstituencySelect(constituency)}>
                {constituency}
              </MenuItem>
            ))}
          </Menu>
        </Grid>
      </Container>

      <Grid container>
        <Grid item xs={12} md={3}>
          {/* Ads Section */}
          <Container className='hidden md:block bg-gray-100 p-4'>Ad Content Here!</Container>
        </Grid>
        <Grid item xs={12} md={9}>
          <Container>
            {/* Main Content Section */}
            {children}
          </Container>
        </Grid>
      </Grid>
    </Container>
  )
}

export const HomeButton = ({ text, href }) => {
  return (
    <Link
      href={href}
      className='text-sm whitespace-nowrap px-3 py-1 border border-blue-500 bg-white text-blue-500 rounded hover:bg-blue-500 hover:text-white'
    >
      {text}
    </Link>
  )
}

export const FilterButton = ({ text }) => {
  return (
    <button className='whitespace-nowrap px-4 py-2 border border-blue-500 bg-white text-blue-500 rounded hover:bg-blue-500 hover:cursor-pointer hover:text-white'>
      {text}
    </button>
  )
}

export const Header = ({ loading, user }) => {
  return (
    <AppBar position='fixed' variant='outlined'>
      <Toolbar>
        <Grid container justifyContent='space-between' alignItems='center' gap={3}>
          <Grid item>
            <Logo />
          </Grid>
          <InputBase
            placeholder='Search constituency, message, post...'
            className=' flex-grow p-1 px-3 border bg-gray-100 border-none rounded placeholder:text-blue-500 max-w-md  outline-none'
          />
          <Grid item>
            {loading && <CircularProgress />}
            {!loading && user ? (
              <UserDropdown />
            ) : (
              <Grid container spacing={2}>
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
        </Grid>
      </Toolbar>
    </AppBar>
  )
}
