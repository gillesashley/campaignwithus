import axios from 'axios'

export const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/posts/`

export const getPosts = (params = {}) => {
  return axios.get(API_URL, { params })
}

export const getTrendingPosts = () => {
  return axios.get(`${API_URL}/trending`)
}

export const getRelatedPosts = postId => {
  return axios.get(`${API_URL}/${postId}/related`)
}

export const getPost = id => {
  return axios.get(`${API_URL}${id}`)
}

export const createPost = (data, token) => {
  return axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const updatePost = (id, data, token) => {
  return axios.put(`${API_URL}${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const deletePost = (id, token) => {
  return axios.delete(`${API_URL}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const uploadPostImage = (id, data, token) => {
  return axios.put(`${API_URL}${id}/photo`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}

export const getPostPoints = (postId, token) => {
  return axios.get(`${API_URL}${postId}/points`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  uploadPostImage,
  getPostPoints
}
