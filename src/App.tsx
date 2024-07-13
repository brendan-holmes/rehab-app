import React, { useState } from 'react';
import { NavBar } from './components/NavBar';
import { ToastContainer, toast } from 'react-toastify';
import { Model } from './components/Model';
import { Landing } from './components/Landing';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth0 } from "@auth0/auth0-react";

import 'react-toastify/dist/ReactToastify.css';

export function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  const model = isAuthenticated ? 
    <ErrorBoundary errorMessage={"Unable to load model"}>
      <Model />
    </ErrorBoundary> :
    isLoading ? 
      <div>Loading...</div> :
      <Landing />;

  return (
    <div className="box-border">
      <NavBar />

      {model}
    
      <ToastContainer 
        hideProgressBar={true}
        pauseOnHover 
        position="bottom-left" 
        pauseOnFocusLoss={false} 
      />
      
      </div>
  );
}
