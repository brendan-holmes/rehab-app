const debug = true;

const logInfo = (...args: any[]) => {
    if (debug) {
        console.log(...args);
    }
}

const logError = (...args: any[]) => {
    if (debug) {
        console.error(...args);
    }
}

export { logInfo, logError };