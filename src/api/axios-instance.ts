import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
  console.warn('VITE_API_BASE_URL is not set; API requests will fail.')
}

export const api = axios.create({
  baseURL: baseURL ?? '',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
