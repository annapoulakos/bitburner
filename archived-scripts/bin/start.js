/** @type @import(".").NS  */
let NS = null;

const FLAGS = [
    ['verbose', false]
];

const SLEEP_DELAY_MS = 30000;

var _ns = null,
    _flags = {},
    _tlog = null,
    _log = null;

function _disableLogs() {
    _ns.disableLog('ALL');
}

function _configure(ns) {
    _ns = ns
    _flags = ns.flags(FLAGS);
    _log = ns.print
    _tlog = ns.tprint

    _disableLogs();
}

function log(message) {
    if (_flags['verbose']) { _tlog(message); }
    _log(message);
}



/**
 * @param {NS} ns
 */
export async function main(ns) {
    _configure(ns);
    log('[start.js] => beginning script execution...');

    log('[start.js] => building hacknet to 10,000/sec production...');
    ns.run('/bin/hacknet.js', 1, '--maxprod', 10000);

    let phase = 1,
        running = ["home", "darkweb", "anna-east-1"];
    log('[start.js] => beginning phase 1');
    while (phase == 1) {
        ns.run('/bin/the-popper-2.js', 1);
        ns.run('/information-services.js', 1, 'list-root');

        const servers = ns.read('/data/is.rooted.txt').split(',');
        servers.forEach(server => {
            if (running.includes(server)) { return; }
            log(`[start.js:${server}] => starting 20 threads...`);
            ns.run('/bin/batch-remote.js', 1, server, 20);
            running.push(server);
        });

        if (ns.getHackingLevel() >= 300) {
            phase = 2;
        } else {
            log(`[start.js] => sleeping for ${(SLEEP_DELAY_MS/1000)|0} seconds...`);
            await ns.sleep(SLEEP_DELAY_MS);
        }
    }

    log(`[start.js] => building hacknet to 50,000/sec production`);
    while (phase == 2) {

    }
}
