// helperfunctions.js

import { getPost, getRelatedPosts } from '@/services/postService'
import pointService from '@/services/pointService'
import pointTypeService from '@/services/pointTypeService'

export const fetchPost = async (postSlug, setPost, setLoading, fetchPointTypesCounts) => {
  try {
    const response = await getPost(postSlug)
    const fetchedPost = response.data.data
    setPost(fetchedPost)
    fetchPointTypesCounts(fetchedPost._id)
  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false)
  }
}

export const fetchRelatedPosts = async (postSlug, setRelatedPosts, setLoading) => {
  try {
    const response = await getRelatedPosts(postSlug)
    setRelatedPosts(response.data.data)
  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false)
  }
}

export const fetchPointTypesCounts = async (
  postId,
  setLikes,
  setLiked,
  setPointId,
  setShares,
  setReads,
  setPointTypesCountUpdate,
  user
) => {
  try {
    const { data } = await pointService.getPostPointTypeCounts(postId)
    data.data.forEach(pt => {
      if (pt.pointType.action === 'Like Post') {
        setLikes(pt.count)
        if (pt.users && user && pt.users.includes(user._id)) {
          setLiked(true)
          setPointId(pt._id)
        }
      }
      if (pt.pointType.action === 'Share Post') {
        setShares(pt.count)
      }
      if (pt.pointType.action === 'Read Post') {
        setReads(pt.count)
      }
    })
  } catch (error) {
    console.error(error)
  } finally {
    setPointTypesCountUpdate(false)
  }
}

export const checkUserLikedPost = async (user, postSlug, setLiked, setPointId) => {
  if (user && !user.isAdmin) {
    try {
      const { data } = await pointService.getUserPoints(user._id)
      const likedPost = data.data.find(
        point => point.postId.slug === postSlug && point.pointTypeId.action === 'Like Post'
      )
      if (likedPost) {
        setLiked(true)
        setPointId(likedPost._id)
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export const fetchPointTypes = async setPointTypes => {
  try {
    const { data } = await pointTypeService.getPointTypes()
    setPointTypes(data.data)
  } catch (error) {
    console.error(error)
  }
}
