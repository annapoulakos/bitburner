//import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

let ns;

async function _log(fn, msg) {
    await ns.print(`[rooterd:${fn}] => ${msg}`);
}

async function _rootTargets() {
    await _log('_rootTargets', 'rooting any available targets');
    const targets = store.getItem('targets'),
          cracks = [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject];

    for (const target of targets) {
        cracks.forEach(fn => {try { fn(target); } catch {}});
        try {
            ns.nuke(target);
            ns.toast(`[rooterd] => rooted ${target}`, 'success', 3000);
        } catch {
            ns.toast(`[rooterd] => unable to root ${target}`, 'warning', 3000);
        }
    }

    await ns.asleep(0);
}

async function _fileCopy() {
    await _log('_fileCopy', 'deploying files to targets')
    const targets = store.getItem('rooted'),
          FILES = [
            '/bin/_grow.js',
            '/bin/_hack.js',
            '/bin/_weaken.js',
            '/bin/batching.js',
            '/bin/list.js',
            '/lib/store.js',
            '/bin/connect.js'
        ];

    for (const target of targets) {
        await ns.scp(FILES, target);
        await ns.asleep(0);
    }
}

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    ns.tail();

    await _log('main', 'starting rooter daemon...');

    while (store.getItem('hosts').length != store.getItem('rooted').length) {
        await _rootTargets();
        await ns.asleep(1000);

        await _fileCopy();
        await ns.asleep(10000);
    }
}
