import axios from 'axios'

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/`

const register = data => {
  return axios.post(`${API_URL}register`, data)
}

const login = data => {
  return axios.post(`${API_URL}login`, data)
}

const forgotPassword = data => {
  return axios.post(`${API_URL}forgotpassword`, data)
}

const resetPassword = (resetToken, data) => {
  return axios.put(`${API_URL}resetpassword/${resetToken}`, data)
}

const updatePassword = (data, token) => {
  return axios.put(`${API_URL}updatepassword`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  return Promise.resolve()
}

export default {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword
}
