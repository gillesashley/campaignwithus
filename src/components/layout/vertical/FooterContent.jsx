'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

import { Typography } from '@mui/material'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import useHorizontalNav from '@menu/hooks/useHorizontalNav'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { settings } = useSettings()
  const { isBreakpointReached: isVerticalBreakpointReached } = useVerticalNav()
  const { isBreakpointReached: isHorizontalBreakpointReached } = useHorizontalNav()

  // Vars
  const isBreakpointReached =
    settings.layout === 'vertical' ? isVerticalBreakpointReached : isHorizontalBreakpointReached

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span className='text-textSecondary'>{`© ${new Date().getFullYear()}, Copyright `}</span>
        <span className='text-textSecondary'>{` . `}</span>
        <span>Campaign With Us</span>
      </p>
      {!isBreakpointReached && (
        <div className='flex items-center gap-4'>
          <Link href='!#' target='_blank' className='text-primary'>
            Support
          </Link>
        </div>
      )}
    </div>
  )
}

export default FooterContent
