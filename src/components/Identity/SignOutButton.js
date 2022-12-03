import { signOut } from '../../identity'

export default function SignOut(props) {
    const handleSignOut = () => {
        signOut();
        props.onSignOut();
    }

    return (
        <button onClick={handleSignOut}>Sign out</button>
    )
}