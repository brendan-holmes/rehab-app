import React from 'react';
import { signOut } from '../../identity'

interface ISignOutButtonProps {
    onSignOut: () => void;
}

export function SignOut(props: ISignOutButtonProps) {
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
