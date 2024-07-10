import axios from 'axios'

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/`

const getUsers = (token, page = 1, limit = 50, search = '') => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      page,
      limit,
      search
    }
  })
}

const getUser = (id, token) => {
  return axios.get(`${API_URL}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const createUser = (data, token) => {
  return axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const updateUser = (id, data, token) => {
  return axios.put(`${API_URL}${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const deleteUser = (id, token) => {
  return axios.delete(`${API_URL}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const updateProfilePhoto = (id, data, token) => {
  return axios.put(`${API_URL}${id}/photo`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
}

const getUserPoints = (userId, token) => {
  return axios.get(`${API_URL}${userId}/points`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const updateBannerPhotos = (userId, formData, token) => {
  return axios.put(`${API_URL}${userId}/banners`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })
}

const removeProfilePhoto = (id, token) => {
  return axios.delete(`${API_URL}${id}/photo`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const removeBannerPhotos = (userId, token) => {
  return axios.delete(`${API_URL}${userId}/banners`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const updateUserProfile = (data, token) => {
  return axios.put(`${API_URL}profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateProfilePhoto,
  getUserPoints,
  updateBannerPhotos,
  removeProfilePhoto,
  removeBannerPhotos,
  updateUserProfile
}
