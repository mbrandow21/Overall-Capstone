import React from 'react';
import './styles/main.css';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Data, Login, Registration, Dashboard, Webpage} from './pages'
import { AuthProvider } from './auth/AuthProvider';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // <AuthProvider>
        <Dashboard />
      // </AuthProvider>
    )
  }, 
  {
    path: "/webpage",
    element: (
      <Webpage />
    )
  }, 
  {
    path: "/:table",
    element: (
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    )
  },   
  {
    path: "/:table/:record",
    element: (
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    )
  },   
  {
    path: "/data",
    element: (
      <AuthProvider>
        <Data />
      </AuthProvider>
    )
  },
  {
    path: "/login",
    element: (
      <Login />
    )
  },
  {
    path: "/register",
    element: (
      <Registration />
    )
  },
  // {
  //   path: "/redirect",
  //   element: isAuthenticated() ? redirect('/data') : redirect('/login')
  // },
])
const root = ReactDOM.createRoot(document.getElementById('root'));
// this is your original root.render function
// the reason why your AuthProvider code is running on every page is because every page is put inside the AuthProvider component
// there is nothing necessarily wrong with this, I did it like this on the IT-Dashboard because I ALWAYS want to know if the user is logged in or not.
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  // <AuthProvider> {/* Ensure AuthProvider is correctly imported */}
  // </AuthProvider>
);
