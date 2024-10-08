import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';


const checkAccessToken = async (token) => await axios({
    method: 'POST',
    url: `http://localhost:5000/auth/checkauth`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    // this is what you had before, axios uses the 'data' property as its body
    // i know it's weird, just get over it
    // body: JSON.stringify( token )
    // data: JSON.stringify( token )
  })
  .then(response => response.data)
  .catch(error => {
    console.error(error);
    // Handling unauthorized access specifically
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized access. Redirecting to login.');
      window.location = '/login';
    } else {
      // Handle other errors
      console.log('An error occurred', error.message);
    }
  });
 

export const AuthContext = createContext( false );


export const AuthProvider = ({ children}) => {

  const [isAuthenticated, setAuthentication] = useState();
  const accessToken = localStorage.getItem('token');


  useEffect(() => {
    if (accessToken) {
      checkAccessToken(accessToken)
        .then(response => {
          setAuthentication(response.authenticated)
        })
    }
    else {
      setAuthentication(false)
    }
  }, [accessToken])

  // DO NOT USE THIS IN PRODUCTION I WILL KILL YOU
  useEffect(() => {
    if (isAuthenticated===false) window.location = '/login';
    if (isAuthenticated===null) window.location = '/login'
    // if (isAuthenticated===undefined) window.location = '/login'
  }, [isAuthenticated])

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};

