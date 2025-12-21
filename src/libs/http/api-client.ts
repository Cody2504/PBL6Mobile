import AsyncStorage from '@react-native-async-storage/async-storage'

const API_BASE_URL = 'http://192.168.2.81:3000/api' // Update with your API Gateway URL
export const API_ORIGIN = API_BASE_URL.replace(/\/?api\/?$/, '')

// Chatbot API runs on a separate port (9876)
const CHATBOT_BASE_URL = API_BASE_URL.replace(':3000', ':9876')
export const CHATBOT_API_ORIGIN = CHATBOT_BASE_URL.replace(/\/?api\/?$/, '')

async function getAuthHeaders() {
  const [accessToken, refreshToken] = await Promise.all([
    AsyncStorage.getItem('accessToken'),
    AsyncStorage.getItem('refreshToken'),
  ])

  return {
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...(refreshToken && { 'x-refresh-token': refreshToken }),
  }
}

export const apiClient = {
  async get<T = any>(endpoint: string): Promise<T> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ GET ${endpoint} failed (${response.status}):`, errorText.substring(0, 200))
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log(`✅ GET ${endpoint} success:`, JSON.stringify(data).substring(0, 200))
    return data
  },

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ POST ${endpoint} failed (${response.status}):`, errorText.substring(0, 200))
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async patch<T = any>(endpoint: string, data?: any): Promise<T> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async delete<T = any>(endpoint: string): Promise<T> {
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
