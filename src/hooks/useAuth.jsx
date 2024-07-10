import { useState, useEffect } from 'react'

const useAuth = () => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'))
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(storedUser)
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(token)
    setUser(user)
    console.log('User:', user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return {
    loading,
    token,
    user,
    login,
    logout
  }
}

export default useAuth
