import { Outlet } from 'react-router-dom'

const ProtectedLayout = () => {
  return (
    <div>
      <h1>Protected Area</h1>
      <Outlet />
    </div>
  )
}

export default ProtectedLayout
