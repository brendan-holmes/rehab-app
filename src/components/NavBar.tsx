
import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from './Identity/LoginButton';
import { LogoutButton } from './Identity/LogoutButton';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export function NavBar() {
  const { user, isAuthenticated } = useAuth0();
  const loginButton = isAuthenticated ? <LogoutButton /> : <LoginButton />;
  const signedInAs = isAuthenticated && user ? 
    <Typography variant="body2" component="div" sx={{ flexGrow: 1 }}>
      Signed in as: {user?.name}
    </Typography> : 
    null;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar className="bg-black">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Rehab
          </Typography>
          {signedInAs}
          <Typography variant="body2">
            {loginButton}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
