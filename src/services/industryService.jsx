import axios from 'axios'

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/industries/`

const getIndustries = () => {
  return axios.get(API_URL)
}

const getIndustry = id => {
  return axios.get(`${API_URL}${id}`)
}

const createIndustry = data => {
  return axios.post(API_URL, data)
}

const updateIndustry = (id, data) => {
  return axios.put(`${API_URL}${id}`, data)
}

const deleteIndustry = id => {
  return axios.delete(`${API_URL}${id}`)
}

export default {
  getIndustries,
  getIndustry,
  createIndustry,
  updateIndustry,
  deleteIndustry
}
