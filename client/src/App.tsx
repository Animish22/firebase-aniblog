import { Outlet, Route, Routes } from "react-router-dom"
import LandingPage from "./components/LandingPage"
import SignUp from "./components/auth/SignUp"
import SignIn from "./components/auth/SignIn"
import Navbar from "./components/Navbar"
import ProtectedRoutes from "./components/auth/ProtectedRoutes"
import UserProfile from "./components/UserProfile"
import DashBoard from "./components/blog/DashBoard"
import Blog from "./components/blog/Blog"
import EditBlogPost from "./components/blog/EditBlogPost"
import AuthProvider from "./context/context"
import { useEffect, useState } from "react"
import { User } from "firebase/auth"
import { auth } from "./firebase/config/firebase"
import CreateBlogPost from "./components/blog/CreateBlogPost"


function App() {
  const [user , setUser] = useState<User | null | undefined>(undefined) ; 
  const [loading , setLoading] = useState<boolean>(true) ; 
  const [error  , setError] = useState<Error | null | undefined>(null) ; 
  useEffect(()=>{
    const fetchCurrentUser = (async ()=>{
      try {
        const userData = auth?.currentUser  as User | null | undefined; 
        setUser(userData) ; 
      } catch (err) {
        setError(err as Error) 
      }finally{
        setLoading(false) ; 
      }
    })


    fetchCurrentUser() ; 
  },[])


  if(loading)
  {
    return(
      <h1>
        Loading.........
      </h1>
    )
  }
  if(error)
  {
    return(
      <h1> Error has occured {error.message} </h1>
    )
  }
  return (
    <AuthProvider value={ {user , setUser} } > 
      <Navbar />
      <Routes>
{/* the outlet followed by index as child is done to match exact url paths for the parent in nested routing in react router dom */}
        <Route element={<Outlet />} path="/">
          <Route index element={<LandingPage />} />
          <Route element={<SignUp />} path="signup" />
          <Route element={<SignIn />} path="signin" />
          <Route element={<ProtectedRoutes />} >
            <Route element={<UserProfile />} path="profile" />
            <Route element={<Outlet />} path="blog">
              <Route index element={<DashBoard />} />
              <Route element={<Blog />} path=":id" />
              <Route element={<CreateBlogPost />} path="add" />
              <Route element={<EditBlogPost />} path=":id/edit" />
            </Route>
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
