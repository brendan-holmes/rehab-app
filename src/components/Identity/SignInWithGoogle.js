import { useState } from 'react';
import useScript from '../../hooks/useScript';
import { signIn } from '../../identity';
import Loading from '../Loading';

export default function SignInWithGoogle(props) {
    const [isLoaded, setIsLoaded] = useState(false);

    const googleSignInScriptUrl = 'https://accounts.google.com/gsi/client';
    const client_id = '85267952322-go49gqteqi6fc24ndqj6c8k7a6meop2f.apps.googleusercontent.com';

    const handleCredentialResponse = (response) => {
        console.log("Encoded JWT ID token: " + response.credential);
    
        signIn(response.credential);
        props.handleSignIn();
    }

    useScript(googleSignInScriptUrl, () => {
        // the window property lets you call any functions that have been loaded in the DOM
        window.google.accounts.id.initialize({
            client_id: client_id,
            callback: handleCredentialResponse
        });

        window.google.accounts.id.renderButton(
            document.getElementById("googleSignInButtonDiv"),
            { theme: "outline", size: "medium", text: "signin_with" }  // customization attributes
        );

        setIsLoaded(true);
    })

    return (
        // todo: replace loading text with loading icon
        <>
            { isLoaded ? <div id="googleSignInButtonDiv"></div> : <Loading /> }
        </>
    )
}