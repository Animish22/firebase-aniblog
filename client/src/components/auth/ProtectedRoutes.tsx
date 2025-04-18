import { useAuth } from '@/context/context'
import { Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      {user ? <Outlet /> : "401 Unauthorized"}
    </>
  )
}

export default ProtectedRoutes