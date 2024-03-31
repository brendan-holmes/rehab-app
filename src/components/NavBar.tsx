import React from "react";

interface INavbarProps {
    children: any;
}

const NavBar = (props: INavbarProps) => {

    return (
        <ul className="NavBar">
            {props.children}
        </ul>
    );
}

export default NavBar;