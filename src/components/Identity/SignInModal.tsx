import React from 'react';
import { SignInWithGoogle } from './SignInWithGoogle';
import { Modal } from '../Modal';

interface ISignInModalProps {
    close: () => void;
    signIn: () => void;
}

export function SignInModal(props: ISignInModalProps) {

    // todo: don't show modal SignInWithGoogle until everything has loaded
    return (

        // todo: replace modal with MUI Dialog - https://mui.com/material-ui/react-dialog/ 
        <Modal closeModal={props.close}>
          <SignInWithGoogle handleSignIn={props.signIn} />
          <p>
            Sign in with Google to get started
          </p>
        </Modal>
    );
}
