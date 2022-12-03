import './App.css';
import React, { useState } from 'react';
// import Info from './components/Info.js';
import NavBar from './components/NavBar';
import ToastContainer from './components/ToastContainer';
import ModelWithData from './components/ModelWithData';
import ErrorBoundary from './components/ErrorBoundary';
import { isSignedIn as identityIsSignedSign } from './identity';
import SignOut from './components/Identity/SignOutButton';
import SignIn from './components/Identity/SignInButton';
import SignInModal from './components/Identity/SignInModal';
import Welcome from './components/Welcome';

function App() {
  const [isListRefreshRequired, setIsListRefreshRequired] = useState(true);
  const [toastList, setToastList] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(identityIsSignedSign());
  const [showSignInModal, setShowSignInModal] = useState(false);

  const addToast = (toast) => {
    setToastList([...toastList, toast]);
  }

  const handleSignIn = () => {
    setIsSignedIn(true);
    setShowSignInModal(false);
    setIsListRefreshRequired(true);
  }

  const handleSignOut = () => {
    setIsSignedIn(false);
    setToastList([]);
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
      <ModelWithData 
        isListRefreshRequired={isListRefreshRequired}
        // todo: passing set State function to another component is an anti-pattern
        setIsListRefreshRequired={setIsListRefreshRequired}
        addToast={addToast}
      />
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
    
      <ToastContainer toastList={toastList} />
      </div>
  );
}

export default App;
