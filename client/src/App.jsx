import { API_BASE_URL } from './config'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import AuthProvider from './context/authProvider'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute'
import ProtectedLayout from './utils/ProtectedLayout'
import LoginPage from './pages/LoginPage'
import RegistrationPage from './pages/RegistrationPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import BookPage from './pages/BookPage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="books/:id" element={<BookPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
