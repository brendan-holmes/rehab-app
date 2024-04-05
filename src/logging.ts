const debug = true;

// allow any input and pass directly to console.log
export function logInfo (...args: any[]) {
    if (debug) {
        console.log(...args);
    }
}

// allow any input and pass directly to console.error
export function logError (...args: any[]) {
    console.error(...args);
}
