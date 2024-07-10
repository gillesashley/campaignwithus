import axios from 'axios'

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/points/`

const getPoints = () => {
  return axios.get(API_URL)
}

const getUserPoints = userId => {
  return axios.get(`${API_URL}user/${userId}`)
}
const getAdminPoints = (adminId, token) => {
  return axios.get(`${API_URL}admin/${adminId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}


const getPostPoints = postId => {
  return axios.get(`${API_URL}post/${postId}`)
}

const getPostPointTypeCounts = postId => {
  return axios.get(`${API_URL}post/${postId}/point-types`)
}

const createPoint = (data, token) => {
  return axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const updatePoint = (id, data) => {
  return axios.put(`${API_URL}${id}`, data)
}

const deletePoint = (id, token) => {
  return axios.delete(`${API_URL}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const getPointTypes = () => {
  return axios.get('/api/point-types')
}

export default {
  getPoints,
  getUserPoints,
  getAdminPoints,
  getPostPoints,
  getPostPointTypeCounts,
  createPoint,
  updatePoint,
  deletePoint,
  getPointTypes
}
