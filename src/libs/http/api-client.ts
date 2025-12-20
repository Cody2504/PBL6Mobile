import AsyncStorage from '@react-native-async-storage/async-storage'

const API_BASE_URL = 'http://10.60.91.2:3000/api' // Update with your API Gateway URL
export const API_ORIGIN = API_BASE_URL.replace(/\/?api\/?$/, '')

async function getAuthHeaders() {
  const token = await AsyncStorage.getItem('accessToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
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
      body: JSON.stringify(data),
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
      body: JSON.stringify(data),
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
      body: JSON.stringify(data),
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
