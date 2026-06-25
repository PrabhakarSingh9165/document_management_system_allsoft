import axios from 'axios'

const BASE_URL = 'https://apis.allsoft.co/api/documentManagement'

const api = axios.create({ baseURL: BASE_URL })

// Attach token from localStorage to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('doc_token')
  if (token) config.headers.token = token
  return config
})

export const generateOTP = (mobile_number) =>
  api.post('/generateOTP', { mobile_number })

export const validateOTP = (mobile_number, otp) =>
  api.post('/validateOTP', { mobile_number, otp })

