// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Util Imports
import ScrollToTop from '@/@core/components/scroll-to-top'
import { getSystemMode } from '@core/utils/serverHelpers'
import { Button } from '@mui/material'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Style Imports
import '@/app/globals.css'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import Script from 'next/script'

export const metadata = {
  title: 'Campaign With Us',
  description: '',
  // name: "google-adsense-account",
  // content:"ca-pub-7889449219437876",
  other: {
    'google-adsense-account': 'ca-pub-7889449219437876',
  },
}


const RootLayout = ({ children }) => {
  // Vars
  const direction = 'ltr'
  const systemMode = getSystemMode()

  return (
    <html id='__next' lang='en' dir={direction}>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7889449219437876"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          />
      </head>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <Providers direction={direction}>
          <BlankLayout>{children}</BlankLayout>

          <ScrollToTop className='mui-fixed'>
            <Button
              variant='contained'
              className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
            >
              <i className='tabler-arrow-up' />
            </Button>
          </ScrollToTop>
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
