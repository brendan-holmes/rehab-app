import React from 'react';

interface INavbarProps {
    children: React.ReactNode;
}

export const NavBar = (props: INavbarProps) => {

    return (
        <ul className='p-0 m-0 flex flex-row flex-wrap items-center h-[6vh] justify-between bg-black'>
            {props.children}
        </ul>
    );
}
