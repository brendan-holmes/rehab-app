import SignInWithGoogle from './SignInWithGoogle';
import Modal from '../Modal';

export default function SignInModal(props) {

    // todo: don't show modal SignInWithGoogle until everything has loaded

    return (

        <Modal handleClose={props.handleClose}>

          <SignInWithGoogle handleSignIn={props.handleSignIn} />

          <div>
            Choose a method to sign in
          </div>

        </Modal>
        
    );

}