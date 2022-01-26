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
