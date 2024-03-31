const debug = true;

const logInfo = (...args: string[]) => {
    if (debug) {
        console.log(...args);
    }
}

const logError = (...args: string[]) => {
    if (debug) {
        console.error(...args);
    }
}

export { logInfo, logError };