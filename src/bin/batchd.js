//import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

let ns;

function _calculateThreads(hostRam) {
    let availableRam = hostRam - 3.05; // the batching script takes 3.05Gb of RAM

    const maxThreads = ((availableRam*0.95) / 1.75)|0;
    return maxThreads
}

async function _log(fn, msg) {
    await ns.print(`[batchd:${fn}] => ${msg}`);
}
/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    ns.tail()

    await _log('main', 'starting batch daemon...');

    while (true) {
        const targets = store.getItem('rooted');

        await _log('main', `configuring batching for ${targets.length} servers`);
        for (const target of targets) {
            const hostRam = store.getItem(`${target}:ram`);

            if (hostRam > 8) {
                const threads = _calculateThreads(hostRam);
                let args = [target, threads];

                await _log('main', `validating batching for ${target} (${threads} threads)`);

                if (!ns.isRunning('/bin/batching.js', target, ...args)) {
                    await _log('main', 'executing batcher');
                    ns.exec('/bin/batching.js', target, 1, ...args);
                    ns.toast(`[batchd] => started ${threads} threads on ${target}`, 'success', 3000);
                } else {
                    await _log('main', 'already running');
                }
            } else {
                await _log('main', `${target} does not have enough ram to support automated batching (${hostRam} Gb available)`);
            }
        }

        await ns.asleep(50000);
    }
}
