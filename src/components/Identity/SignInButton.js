export default function SignOut(props) {
    const handleSignIn = () => {
        props.handleClick();
    }

    return (
        <button onClick={handleSignIn}>Sign in</button>
    )
}