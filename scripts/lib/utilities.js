const FLAGS = [
    ['verbose', false],
    ['silent', false]
];


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
