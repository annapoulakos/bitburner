import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

let ns;

function _calculateThreads(hostRam) {
    let availableRam = hostRam - 3.05; // the batching script takes 3.05Gb of RAM

    const maxThreads = ((availableRam*0.95) / 1.75)|0;
    return maxThreads
}

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    utils.log('[batch-daemon:main] => starting batch daemon...');

    while (true) {
        const targets = store.getItem('rooted');

        utils.log(`[batch-daemon:main] => configuring batching for ${targets.length} servers`);
        for (const target of targets) {
            const hostRam = store.getItem(`${target}:ram`);

            if (hostRam > 8) {
                const threads = _calculateThreads(hostRam);
                let args = [target, threads];

                utils.log(`[batch-daemon:main] => validating batching for ${target} (${threads} threads)`);

                if (!ns.isRunning('/bin/batching.js', target, ...args)) {
                    utils.log('[batch-daemon:main] => executing batcher');
                    ns.exec('/bin/batching.js', target, 1, ...args);
                } else {
                    utils.log('[batch-daemon:main] => already running');
                }
            } else {
                utils.log(`[batch-daemon:main] => ${target} does not have enough ram to support automated batching (${hostRam} Gb available)`);
            }
        }

        await ns.sleep(5000);
    }
}
