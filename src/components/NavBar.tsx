import React from 'react';

interface INavbarProps {
    children: React.ReactNode;
}

export const NavBar = (props: INavbarProps) => {

    return (
        <ul className='NavBar'>
            {props.children}
        </ul>
    );
}
