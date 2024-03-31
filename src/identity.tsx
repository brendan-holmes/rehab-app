import { Buffer } from 'buffer';
import { logInfo } from './logging';

function getJwt(): string {
    // todo: use cookie
    const data = sessionStorage.getItem('userLoginJwt');

    if (data) {
        const jwt = JSON.parse(data);

        if (jwt) {
            return jwt;
        }

        return '';
    }

    return '';
}

function parseJwt (token: string): string {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

function signIn(jwt: string): void {
    logInfo('Signing in user...');
    // todo: save in cookie instead of session storage
    sessionStorage.setItem('userLoginJwt', JSON.stringify(jwt))
}

function isSignedIn(): boolean {
    if (getJwt()) {
        logInfo('User is signed in');
        return true;
    }
    return false;
}

function signOut(): void {
    // todo: remove cookie
    sessionStorage.removeItem('userLoginJwt');
    logInfo('Signing out user...');
}

export { getJwt, parseJwt, isSignedIn, signOut, signIn };