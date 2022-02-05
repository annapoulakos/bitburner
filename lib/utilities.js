const FLAGS = [
    ['verbose', false],
    ['silent', false]
];

export const PORTS = {
    info: {
        in: 5,
        out: 6
    },
    db: {
        in: 7,
        out: 8
    },
    k8s: {
        in: 10,
        out: 11
    },
    batch: {
        in: 15,
        out: 16
    }
};

export const IDENTIFIERS = {
    batchd: '/bin/batchd.js',
    nethackd: '/bin/nethackd.js',
    rooterd: '/bin/rooterd.js',
    shared: '/bin/shared.js',
    statmon: '/bin/statmon.js'
}

let ns = null,
    flags = {};


/**
 * @param {NS} _ns
 */
export function configure(_ns) {
    ns = _ns;
    flags = ns.flags(FLAGS);

    ns.disableLog('ALL');
}

/**
 * Logs messages, to the log file or terminal
 * @param {string} message
 */
export function log(message) {
    if (!flags['silent']) {
        if (flags['verbose']) { ns.tprint(message); }
        ns.print(message);
    }
}

/**
 * Reads a given file without needing to pass NS around everywhere
 * @param {string} filename
 * @returns string
 */
export function read(filename) {
    return ns.read(filename);
}


export function nowString() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}-${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`;
}


/**
 * Toast Management
 */
const TOAST_TIME = 3000;
export function success(message) {
    ns.toast(message, 'success', TOAST_TIME);
}
export function info(message) {
    ns.toast(message, 'info', TOAST_TIME);
}
export function warn(message) {
    ns.toast(message, 'warning', TOAST_TIME);
}
export function error(message) {
    ns.toast(message, 'error', TOAST_TIME);
}
