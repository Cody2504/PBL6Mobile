import AsyncStorage from '@react-native-async-storage/async-storage'

const API_BASE_URL = 'http://192.168.2.81:3000/api' // Update with your API Gateway URL
export const API_ORIGIN = API_BASE_URL.replace(/\/?api\/?$/, '')

// Chatbot API runs on a separate port (9876)
const CHATBOT_BASE_URL = API_BASE_URL.replace(':3000', ':9876')
export const CHATBOT_API_ORIGIN = CHATBOT_BASE_URL.replace(/\/?api\/?$/, '')

async function getAuthHeaders() {
  const token = await AsyncStorage.getItem('accessToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const apiClient = {
  async get(endpoint: string) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async post(endpoint: string, data: any) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async patch(endpoint: string, data: any) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async put(endpoint: string, data: any) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async delete(endpoint: string) {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  },
}
