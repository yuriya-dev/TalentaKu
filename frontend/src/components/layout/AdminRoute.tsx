import { Navigate, Outlet } from 'react-router-dom'

export default function AdminRoute() {
  const token = localStorage.getItem('admin_token')

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  try {
    // Basic JWT expiration check
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      return <Navigate to="/admin/login" replace />
    }
  } catch (e) {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
