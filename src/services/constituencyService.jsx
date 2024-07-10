import axios from 'axios'

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/constituencies/`

const getConstituencies = regionId => {
  return axios.get(regionId ? `${API_URL}?regionId=${regionId}` : API_URL)
}

const getConstituency = id => {
  return axios.get(`${API_URL}${id}`)
}

const createConstituency = data => {
  return axios.post(API_URL, data)
}

const updateConstituency = (id, data) => {
  return axios.put(`${API_URL}${id}`, data)
}

const deleteConstituency = id => {
  return axios.delete(`${API_URL}${id}`)
}

export default {
  getConstituencies,
  getConstituency,
  createConstituency,
  updateConstituency,
  deleteConstituency
}
