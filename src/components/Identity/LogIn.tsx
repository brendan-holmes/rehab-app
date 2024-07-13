import React from 'react';
import { SignInWithGoogle } from './SignInWithGoogle';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface LogInProps {
    isAuthenticated: boolean;
    handleLogIn: () => void;
    handleLogOut: () => void;
}

export function LogIn(props: LogInProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    props.isAuthenticated ? props.handleLogOut() : setOpen(true);
  };

  const handleSignIn = () => {
    props.handleLogIn();
    setOpen(false);
  }
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
        <button 
            className='hover:cursor-pointer'
            onClick={handleClickOpen}
            >{props.isAuthenticated ? "Sign out" : "Sign in"}</button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className="min-h-100 min-w-100"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Sign In
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom component={'span'} variant={'body2'}>
            <SignInWithGoogle handleSignIn={handleSignIn}/>
          </Typography>
          <Typography gutterBottom component={'span'} variant={'body2'}>
            Placeholder text Placeholder text Placeholder text Placeholder text Placeholder text Placeholder text 
            Placeholder text Placeholder text Placeholder text Placeholder text Placeholder text Placeholder text 
            Placeholder text Placeholder text Placeholder text Placeholder text Placeholder text Placeholder text 
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
