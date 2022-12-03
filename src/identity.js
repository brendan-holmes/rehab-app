import { Buffer } from 'buffer';
import { log } from './logging';

function getJwt() {
    // todo: use cookie
    const data = sessionStorage.getItem('userLoginJwt');

    if (data) {
        const jwt = JSON.parse(data);

        if (jwt) {
            return jwt;
        }

        return null;
    }

    return null;
}

function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

function signIn(jwt) {
    log('Signing in user...');
    // todo: save in cookie instead of session storage
    sessionStorage.setItem('userLoginJwt', JSON.stringify(jwt))
}

function isSignedIn() {
    if (getJwt()) {
        log('User is signed in');
        return true;
    }
    return false;
}

function signOut() {
    // todo: remove cookie
    sessionStorage.removeItem('userLoginJwt');
    log('Signing out user...');
}

export { getJwt, parseJwt, isSignedIn, signOut, signIn };