/**
 * Layout component for the frontend application.
 * This component is used to wrap other components and provide common layout
 * functionality.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {ReactNode} props.children - The child components to be wrapped by the layout.
 * @return {JSX.Element} The layout component.
 */

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

/**
 * The layout component for the frontend application.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components to be wrapped by the layout.
 * @return {JSX.Element} The layout component.
 */
const Layout = ({ children }) => {
  // Vars
  const direction = 'ltr'
  const systemMode = getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout>
        {/* <PublicPagesLayout>{children}</PublicPagesLayout> */}

        {children}
      </BlankLayout>

      {/* <ScrollToTop className='mui-fixed'>
        <Button variant='contained' className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'>
          <i className='tabler-arrow-up' />
        </Button>
      </ScrollToTop> */}
    </Providers>
  )
}

export default Layout

