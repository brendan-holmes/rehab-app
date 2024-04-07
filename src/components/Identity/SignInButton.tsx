import React from 'react';

interface ISignInButtonProps {
    handleClick: () => void;
}

export function SignInButton(props: ISignInButtonProps) {
    const handleSignIn = () => {
        props.handleClick();
    }

    return (
        <button 
            className='hover:cursor-pointer'
            onClick={handleSignIn}
            >Sign in</button>
    )
}
