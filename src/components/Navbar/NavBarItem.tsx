import React from 'react';

interface INavbarItemProps {
    children: React.ReactNode;
}

export const NavBarItem = (props: INavbarItemProps) => {

    return (
        <ul className='text-white p-2'>
            {props.children}
        </ul>
    );
}
