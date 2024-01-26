import React, { useContext } from 'react'; // Import useContext here
import { AuthContext } from './AuthProvider';
import { Navigate } from 'react-router-dom';

export const WithAuth = (Component) => {
  const AuthWrappedComponent = (props) => {
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
      return <Navigate to="/Login" replace />;
    }

    return <Component {...props} />;
  };

  return AuthWrappedComponent;
};
