// import React from 'react';

// interface INavbarProps {
//     children: React.ReactNode;
// }

// export const NavBar = (props: INavbarProps) => {

//     return (
//         <ul className='p-0 m-0 flex flex-row flex-wrap items-center h-[6vh] justify-between bg-black'>
//             {props.children}
//         </ul>
//     );
// }

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { LogIn } from './Identity/LogIn';

interface NavbarProps {
    // children: React.ReactNode;
    isAuthenticated: boolean;
    handleLogIn: () => void;
    handleLogOut: () => void;
}

export function NavBar(props: NavbarProps) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className="bg-black">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Rehab
          </Typography>
          <LogIn handleLogIn={props.handleLogIn} handleLogOut={props.handleLogOut} isAuthenticated={props.isAuthenticated}/>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
