const verticalMenuData = () => [
  {
    label: 'Dashboard',
    href: '/home/dashboard',
    icon: 'tabler-smart-home'
  },
  {
    label: 'Profile',
    href: '/home/profile',
    icon: 'tabler-user'
  },
  {
    label: 'Help',
    href: '/home/help',
    icon: 'tabler-info-circle'
  },
  {
    label: 'Points & Payments',
    href: '/home/point-payment',
    icon: 'tabler-tools'
  },
  {
    label: 'Content',
    href: '/home/content',
    icon: 'tabler-file-text'
  },
  {
    label: 'Admin',
    icon: 'tabler-settings',
    children: [
      {
        label: 'Users',
        href: '/home/admin/users',
        icon: 'tabler-users'
      },
      {
        label: 'Settings',
        href: '/home/admin/settings',
        icon: 'tabler-settings'
      }
    ]
  }
]

export default verticalMenuData
