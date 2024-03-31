import React from 'react';
import { signOut } from '../../identity'

interface ISignOutProps {
    onSignOut: () => void;
}

export default function SignOut(props: ISignOutProps) {
    const handleSignOut = () => {
        signOut();
        props.onSignOut();
    }

    return (
        <button onClick={handleSignOut} className="sign-out-button">
            Sign out
        </button>
    )
}