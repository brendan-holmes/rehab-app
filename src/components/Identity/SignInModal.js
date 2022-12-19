import SignInWithGoogle from './SignInWithGoogle';
import Modal from '../Modal';

export default function SignInModal(props) {

    // todo: don't show modal SignInWithGoogle until everything has loaded

    return (

        <Modal handleClose={props.handleClose}>

          <SignInWithGoogle handleSignIn={props.handleSignIn} />

          <div>
            Sign in with Google to get started
          </div>

        </Modal>
        
    );

}