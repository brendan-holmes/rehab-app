import { signOut } from '../../identity'

export default function SignOut(props) {
    const handleSignOut = () => {
        signOut();
        props.onSignOut();
    }

    return (
        <button onClick={handleSignOut} className="sign-out-button">
            Sign out
        </button>
    )
}