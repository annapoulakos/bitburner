var FLAGS = [
    ['verbose', false],
];
var flags = {};
var _logger = null;

/**
 * Configures internal AWS settings
 *
 * @param {NS} ns
 * @param {Array} custom_flags
 **/
export function configure(ns, custom_flags) {
    _logger = ns.tprint;

    const new_flags = FLAGS.concat(custom_flags);
    flags = ns.flags(FLAGS.concat(custom_flags));
}

/**
 * Gets the value of a flag, with appropriate default value.
 *  Returns null if default not set.
 *
 * @param {string} flagName
 **/
export function get(flagName, _default=null) {
    return flags[flagName] || _default;
}

/**
 * Logs a message to the terminal if the verbose flag is set.
 *
 * @param {string} message
 */
export function log(message) {
    if (get("verbose", false)) { _logger(message); }
}

export function noop(...args) {}
