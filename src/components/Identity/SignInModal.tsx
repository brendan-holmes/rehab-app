import React from 'react';
import SignInWithGoogle from './SignInWithGoogle';
import Modal from '../Modal';
// const Modal = require('../Modal');

interface ISignInModalProps {
    handleClose: () => void;
    handleSignIn: () => void;
}

export default function SignInModal(props: ISignInModalProps) {

    // todo: don't show modal SignInWithGoogle until everything has loaded

    return (

        <Modal handleClose={props.handleClose}>

          <SignInWithGoogle handleSignIn={props.handleSignIn} />

          <div>
            Sign in with Google to get started
          </div>

        </Modal>
        
    );

}