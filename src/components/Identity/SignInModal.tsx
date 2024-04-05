import React from 'react';
import { SignInWithGoogle } from './SignInWithGoogle';
import { Modal } from '../Modal';

interface ISignInModalProps {
    handleClose: () => void;
    handleSignIn: () => void;
}

export function SignInModal(props: ISignInModalProps) {

    // todo: don't show modal SignInWithGoogle until everything has loaded
    return (
        <Modal handleClose={props.handleClose}>
          <SignInWithGoogle handleSignIn={props.handleSignIn} />
          <p>
            Sign in with Google to get started
          </p>
        </Modal>
    );
}
