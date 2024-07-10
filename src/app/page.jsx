// Next Imports
import PostsProvider from '@/providers/PostsProvider'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Homepage } from '@/components/pages/Homepage'
import { PublicPagesLayout } from '@/components/layout/public-pages-layout/PublicPagesLayout'

export default function Page() {
  return (
    <PostsProvider>
      <Homepage />
    </PostsProvider>
  )
}
