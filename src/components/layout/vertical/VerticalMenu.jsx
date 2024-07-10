'use client'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, MenuItem, SubMenu } from '@menu/vertical-menu'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useVerticalNav from '@menu/hooks/useVerticalNav'
import useAuth from '../../../hooks/useAuth' // Corrected import

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const { isBreakpointReached } = useVerticalNav()
  const { user } = useAuth() // Get the user from useAuth hook

  // Vars
  const { transitionDuration } = verticalNavOptions
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem href='/' icon={<i className='tabler-home' />}>
          Home
        </MenuItem>
        <MenuItem href='/home/dashboard' icon={<i className='tabler-dashboard' />}>
          Dashboard
        </MenuItem>
        {user?.isAdmin && (
          <MenuItem href='/home/content' icon={<i className='tabler-file-text' />}>
            Content
          </MenuItem>
        )}
        <MenuItem href='/home/point-payment' icon={<i className='tabler-cash' />}>
          Points & Payments
        </MenuItem>

        {/* Render admin menu items only if user is admin */}
        {user?.isAdmin && (
          <SubMenu label='Admin' icon={<i className='tabler-settings' />}>
            <MenuItem href='/home/admin/users' icon={<i className='tabler-users' />}>
              Users
            </MenuItem>
            <MenuItem href='/home/admin/settings' icon={<i className='tabler-settings' />}>
              Settings
            </MenuItem>
          </SubMenu>
        )}

        <MenuItem href='/home/profile' icon={<i className='tabler-user' />}>
          Profile
        </MenuItem>
        <MenuItem href='/home/help' icon={<i className='tabler-info-circle' />}>
          Help
        </MenuItem>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
