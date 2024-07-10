/**
 * PostsPage component
 *
 * This component is the main page for showing all posts. It wraps the Homepage component
 * with the PostsProvider component, which provides the necessary data for the Homepage component.
 *
 * @return {JSX.Element} The rendered PostsPage component
 */
import { Homepage } from '@/components/pages/Homepage'
import PostsProvider from '@/providers/PostsProvider'

const PostsPage = () => {
  return (
    <PostsProvider>
      <Homepage />
    </PostsProvider>
  )
}

export default PostsPage

