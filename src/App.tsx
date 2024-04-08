import React, { useState } from 'react';
import { NavBar } from './components/NavBar';
import { ToastContainer, toast } from 'react-toastify';
import { Model } from './components/Model';
import { isSignedIn as identityIsSignedSign } from './components/Identity/identityActions';
import { Landing } from './components/Landing';
import { ErrorBoundary } from './components/ErrorBoundary';

import 'react-toastify/dist/ReactToastify.css';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(identityIsSignedSign());

  function logIn() {
    setIsAuthenticated(true);
  }

  function logOut() {
    setIsAuthenticated(false);
    toast.dismiss();
  }

  // React is not re-evaluating isSignedIn(), might need to trigger it 
  // manually or link it to a prop
  const model = isAuthenticated ? 
    <ErrorBoundary errorMessage={"Unable to load model"}>
      <Model />
    </ErrorBoundary> :
    null;

  return (
    <div className="box-border">
      <NavBar handleLogIn={logIn} handleLogOut={logOut} isAuthenticated={isAuthenticated} />

      {model}

      {isAuthenticated ? null : 
        <Landing />
      }
    
      <ToastContainer />
      
      </div>
  );
}
