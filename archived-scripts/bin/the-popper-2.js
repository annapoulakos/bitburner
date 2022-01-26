const FLAGS = [
    ['verbose', false]
];

var _ns = null;
var _flags = null;

function _configure(ns) {
    _ns = ns;
    _flags = ns.flags(FLAGS);
}

function log(message) {
    if (_flags['verbose']) { _ns.tprint(message); }
    _ns.print(message);
}

function _loadTargets() {
    _ns.run('/information-services.js', 1, 'list-targets');
    let targets = _ns.read('/data/is.targets.txt').split(',');

    return targets;
}

function _break(target) {
    const fns = [_ns.brutessh, _ns.ftpcrack, _ns.relaysmtp, _ns.httpworm, _ns.sqlinject];

    fns.forEach(fn => {
        try { fn(target); } catch {}
    });
}


/**
 * @param {NS} ns
 */
export async function main(ns) {
    _configure(ns);

    const targets = _loadTargets(),
          skips = ['home', 'darkweb'];

    [_break, ns.nuke].forEach(fn => {
        targets.forEach(target => {
            log(`[the-popper] => ${fn.name} on ${target}`);
            if (skips.includes(targets)) { return; }
            try { fn(target); } catch {}
        });
    });
}
