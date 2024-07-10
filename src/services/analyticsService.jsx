import axios from 'axios'

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/analytics/`

const getUserAnalytics = token => {
  return axios.get(`${API_URL}user`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const getAdminAnalytics = token => {
  return axios.get(`${API_URL}admin`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const getPublicAnalytics = () => {
  return axios.get(`${API_URL}public`)
}

export default {
  getUserAnalytics,
  getAdminAnalytics,
  getPublicAnalytics
}
