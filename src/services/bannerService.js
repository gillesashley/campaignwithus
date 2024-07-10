import axios from 'axios'

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/banners`

const getBanners = () => {
  return axios.get(API_URL)
}

export default {
  getBanners
}
