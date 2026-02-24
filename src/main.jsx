import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from './Components/UserContext.jsx';
import GuestRoute from './Components/GuestRoute.jsx';
import AuthForm from './Components/AuthForm.jsx';
import BookingComponent from './Components/BookingComponent.jsx';
import AllBikes from './Components/AllBikes.jsx';
import OccupiedDates from './Components/OccupiedDates.jsx';
import PaymentHome from './Components/PaymentHome.jsx';
import PaymentPage from './Components/PaymentPage.jsx';
import SuccessPage from './Components/SuccessPage.jsx';
import FailurePage from './Components/FailurePage.jsx';


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
        path: "/all-bikes",
        element: <AllBikes></AllBikes>,
      },
      {
        path: "/my-rides",
        element: <OccupiedDates></OccupiedDates>
      },
      {
      path: "/payment-home",
      element: <PaymentHome />,
    },
    {
      path: "/payment",
      element: <PaymentPage />,
    },
    {
      path: "/success",
      element: <SuccessPage></SuccessPage>,
    },
    {
      path: "/failure",
      element: <FailurePage></FailurePage>,
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
