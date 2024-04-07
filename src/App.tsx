import React, { useState } from 'react';
import { NavBar } from './components/Navbar/NavBar';
import { NavBarItem } from './components/Navbar/NavBarItem';
import { ToastContainer, toast } from 'react-toastify';
import { Model } from './components/Model';
import { isSignedIn as identityIsSignedSign } from './identity';
import { SignOut } from './components/Identity/SignOutButton';
import { SignInButton } from './components/Identity/SignInButton';
import { Landing } from './components/Landing';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SignInModal } from './components/Identity/SignInModal';

import 'react-toastify/dist/ReactToastify.css';

export function App() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(identityIsSignedSign());
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);

  function signIn() {
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

  function closeSignInModal() {
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
    <div className="box-border">
      <NavBar>
        <NavBarItem>Rehab</NavBarItem>
        <NavBarItem>{ isSignedIn ? <SignOut onSignOut={handleSignOut} /> : <SignInButton handleClick={handleSignInClick} /> }</NavBarItem>
      </NavBar>

      {model}

      {showSignInModal ? 
        <SignInModal signIn={signIn} close={closeSignInModal}/> :
        null
      }

      {isSignedIn ? null : 
        <Landing />
      }
    
      <ToastContainer />
      
      </div>
  );
}
