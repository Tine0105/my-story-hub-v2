// src/services/api.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submit-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Đăng ký thất bại')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Không thể lấy dữ liệu')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}
