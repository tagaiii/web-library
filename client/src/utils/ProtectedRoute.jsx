import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider' // Импортируем контекст

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext)

  if (!user) {
    return <Navigate to="/login" /> // Перенаправляем на страницу логина
  }

  return children
}

export default ProtectedRoute
