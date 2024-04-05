import React from 'react';

interface ISignInButtonProps {
    handleClick: () => void;
}

export function SignInButton(props: ISignInButtonProps) {
    const handleSignIn = () => {
        props.handleClick();
    }

    return (
        <button onClick={handleSignIn}>Sign in</button>
    )
}
