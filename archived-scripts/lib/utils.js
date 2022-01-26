const FLAGS = [
    ['verbose', false],
];

let flags = {};
let _log = null;
let _tlog = null;

export function configure(ns, custom_flags) {
    _log = ns.print;
    _tlog = ns.tprint;

    flags = ns.flags(custom_flags.concat(FLAGS));
}

export function log(message) {
    if (flags['verbose']) {
        _tlog(message);
    }

    _log(message);
}
