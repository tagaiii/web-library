import { createContext, useState, useEffect } from 'react'
import jwt_decode from 'jwt-decode'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const decoded = jwt_decode(token)
        setUser(decoded)
      } catch (error) {
        console.error('Invalid token', error)
        setUser(null)
      }
    }
  }, [])

  const login = token => {
    localStorage.setItem('accessToken', token)
    const decoded = jwt_decode(token)
    setUser(decoded)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
