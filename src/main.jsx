import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from './Components/UserContext.jsx';
import GuestRoute from './Components/GuestRoute.jsx';
import AuthForm from './Components/AuthForm.jsx';
import BookingComponent from './Components/BookingComponent.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <BookingComponent></BookingComponent>,
      },
      {
      path:'/auth',
      element: (
        <GuestRoute> <AuthForm></AuthForm> </GuestRoute>
      )
    }]
  }
])
  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
    <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
