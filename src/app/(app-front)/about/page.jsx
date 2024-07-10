import { PublicPagesLayout } from '@/components/layout/public-pages-layout/PublicPagesLayout'
import PostsProvider from '@/providers/PostsProvider'

export default function Page() {
  return (
    <PostsProvider>
      <PublicPagesLayout>
        <h1>About page!</h1>
      </PublicPagesLayout>
    </PostsProvider>
  )
}
