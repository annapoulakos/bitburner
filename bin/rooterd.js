import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

let ns;

async function _rootTargets() {
    utils.log('[rooterd:root] => rooting any available targets');
    const targets = store.getItem('targets'),
          cracks = [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject];
    targets.forEach(target => {
        cracks.forEach(fn => {try { fn(target); } catch {}});
        try {
            ns.nuke(target);
            utils.success(`[rooterd] => rooted ${target}`);
        } catch {
            utils.warn(`[rooterd] => unable to root ${target}`);
        }
    });

    await ns.sleep(0);
}

async function _fileCopy() {
    utils.log('[rooterd:scp] => deploying files to targets')
    const targets = store.getItem('rooted'),
          FILES = [
            '/bin/_grow.js',
            '/bin/_hack.js',
            '/bin/_weaken.js',
            '/bin/batching.js',
            '/bin/list.js',
            '/lib/utilities.js',
            '/lib/store.js',
            '/bin/connect.js'
        ];

    for (const target of targets) {
        await ns.scp(FILES, target);
        await ns.sleep(0);
    }
}
/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    utils.log('[rooterd:main] => starting crack daemon...');

    while (true) {
        await _rootTargets();
        await ns.sleep(1000);

        await _fileCopy();
        await ns.sleep(10000);
    }
}
