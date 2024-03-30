const debug = true;

const logInfo = (...args) => {
    if (debug) {
        console.log(...args);
    }
}

const logError = (...args) => {
    if (debug) {
        console.error(...args);
    }
}

export { logInfo, logError };