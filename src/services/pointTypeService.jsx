import axios from 'axios'

export const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/point-types/`

export const getPointTypes = token => {
  return axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } })
}

export const getPointType = (id, token) => {
  return axios.get(`${API_URL}${id}`, { headers: { Authorization: `Bearer ${token}` } })
}

export const createPointType = (data, token) => {
  return axios.post(API_URL, data, { headers: { Authorization: `Bearer ${token}` } })
}

export const updatePointType = (id, data, token) => {
  return axios.put(`${API_URL}${id}`, data, { headers: { Authorization: `Bearer ${token}` } })
}

export const deletePointType = (id, token) => {
  return axios.delete(`${API_URL}${id}`, { headers: { Authorization: `Bearer ${token}` } })
}

export default {
  getPointTypes,
  getPointType,
  createPointType,
  updatePointType,
  deletePointType
}
