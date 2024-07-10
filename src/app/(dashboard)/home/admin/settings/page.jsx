'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import { Tabs, Tab, Box } from '@mui/material'
import RegionsTab from './RegionsTab'
import ConstituenciesTab from './ConstituenciesTab'

const SettingsPage = () => {
  const [currentTab, setCurrentTab] = useState(0)

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={currentTab} onChange={handleChange} aria-label='settings tabs'>
        <Tab label='Regions' />
        <Tab label='Constituencies' />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {currentTab === 0 && <RegionsTab />}
        {currentTab === 1 && <ConstituenciesTab />}
      </Box>
    </Box>
  )
}

export default SettingsPage
