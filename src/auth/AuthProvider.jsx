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
  .catch(error => console.error(error));

export const AuthContext = createContext( false );


export const AuthProvider = ({ children}) => {

  const [isAuthenticated, setAuthentication] = useState();
  const accessToken = localStorage.getItem('token');

  useEffect(() => {
    if (accessToken) {
      console.log(accessToken);
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
  }, [isAuthenticated])

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};

