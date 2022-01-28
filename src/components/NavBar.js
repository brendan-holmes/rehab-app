import React from "react";

const NavBar = (props) => {

    return (
        <ul className="NavBar">
            {props.children}
        </ul>
    );
}

export default NavBar;