import React from 'react';

interface ISignOutProps {
    handleClick: () => void;
}

export default function SignOut(props: ISignOutProps) {
    const handleSignIn = () => {
        props.handleClick();
    }

    return (
        <button onClick={handleSignIn}>Sign in</button>
    )
}