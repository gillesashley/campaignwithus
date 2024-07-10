import axios from 'axios'

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/regions/`

const getRegions = () => {
  return axios.get(API_URL)
}

const getRegion = id => {
  return axios.get(`${API_URL}${id}`)
}

const createRegion = data => {
  return axios.post(API_URL, data)
}

const updateRegion = (id, data) => {
  return axios.put(`${API_URL}${id}`, data)
}

const deleteRegion = id => {
  return axios.delete(`${API_URL}${id}`)
}

export default {
  getRegions,
  getRegion,
  createRegion,
  updateRegion,
  deleteRegion
}
