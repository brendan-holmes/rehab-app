import './App.css';
import React, { useState } from 'react';
import NavBar from './components/NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Model from './components/Model';
import { isSignedIn as identityIsSignedSign } from './identity';
import SignOut from './components/Identity/SignOutButton';
import SignIn from './components/Identity/SignInButton';
import Welcome from './components/Welcome';
import ErrorBoundary from './components/ErrorBoundary';
import SignInModal from './components/Identity/SignInModal';

function App() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(identityIsSignedSign());
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);

  const handleSignIn = () => {
    setIsSignedIn(true);
    setShowSignInModal(false);
  }

  const handleSignOut = () => {
    setIsSignedIn(false);
    toast.dismiss();
  }

  const handleSignInClick = () => {
    setShowSignInModal(true);
  }

  const handleCloseSignInModal = () => {
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
        <li>{ isSignedIn ? <SignOut onSignOut={handleSignOut} /> : <SignIn handleClick={handleSignInClick} /> }</li>
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

export default App;
