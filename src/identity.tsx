import { Buffer } from 'buffer';
import { logInfo } from './logging';
import { Jwt } from './types/Jwt';

export function getJwt(): string {
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

export function parseJwt (token: string): Jwt {
    const jwt = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return jwt;
}

export function signIn(jwt: string): void {
    logInfo('Signing in user...');
    // todo: save in cookie instead of session storage
    sessionStorage.setItem('userLoginJwt', JSON.stringify(jwt))
}

export function isSignedIn(): boolean {
    if (getJwt()) {
        logInfo('User is signed in');
        return true;
    }
    return false;
}

export function signOut(): void {
    // todo: remove cookie
    sessionStorage.removeItem('userLoginJwt');
    logInfo('Signing out user...');
}
