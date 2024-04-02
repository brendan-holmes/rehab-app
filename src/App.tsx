import React, { useState } from 'react';
import { NavBar } from './components/NavBar';
import { ToastContainer, toast } from 'react-toastify';
import { Model } from './components/Model';
import { isSignedIn as identityIsSignedSign } from './identity';
import { SignOut } from './components/Identity/SignOutButton';
import { SignInButton } from './components/Identity/SignInButton';
import { Welcome } from './components/Welcome';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SignInModal } from './components/Identity/SignInModal';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

export function App() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(identityIsSignedSign());
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);

  function handleSignIn() {
    setIsSignedIn(true);
    setShowSignInModal(false);
  }

  function handleSignOut() {
    setIsSignedIn(false);
    toast.dismiss();
  }

  function handleSignInClick() {
    setShowSignInModal(true);
  }

  function handleCloseSignInModal() {
    setShowSignInModal(false);
  }

  // React is not re-evaluating isSignedIn(), might need to trigger it 
  // manually or link it to a prop
  const model = isSignedIn ? 
    <ErrorBoundary errorMessage={"Unable to load model"}>
      <Model />
    </ErrorBoundary> :
    null;

  return (
    <div className="App">
      <NavBar>
        <li>Rehab</li>
        <li>{ isSignedIn ? <SignOut onSignOut={handleSignOut} /> : <SignInButton handleClick={handleSignInClick} /> }</li>
      </NavBar>

      {model}

      {showSignInModal ? 
        <SignInModal handleSignIn={handleSignIn} handleClose={handleCloseSignInModal}/> :
        null
      }

      {isSignedIn ? null : 
        <Welcome />
      }
    
      <ToastContainer />
      
      </div>
  );
}
