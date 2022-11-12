const debug = false;

const log = (message) => {
    if (debug) {
        console.log(message);
    }
}

const error = (message) => {
    if (debug) {
        console.error(message);
    }
}

export { log, error };