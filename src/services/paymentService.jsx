import axios from 'axios'

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments`

const createPayment = (token, { pointsToWithdraw, phoneNumber }) => {
  return axios.post(
    API_URL,
    { pointsToWithdraw, phoneNumber },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}

const verifyPayment = (reference, token) => {
  return axios.post(
    `${API_URL}/verify`,
    { reference },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}

const getUserPayments = token => {
  return axios.get(`${API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const getAdminPayments = token => {
  return axios.get(`${API_URL}/admin`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const updatePaymentStatus = (paymentId, status, token, pointsWithdrawn) => {
  return axios.patch(
    `${API_URL}/${paymentId}/status`,
    { status, pointsWithdrawn },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}

export default {
  createPayment,
  verifyPayment,
  getUserPayments,
  getAdminPayments,
  updatePaymentStatus
}
