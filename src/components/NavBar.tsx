import React from "react";

interface INavbarProps {
    children: React.ReactNode;
}

const NavBar = (props: INavbarProps) => {

    return (
        <ul className="NavBar">
            {props.children}
        </ul>
    );
}

export default NavBar;