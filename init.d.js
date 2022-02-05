import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';
let ns;

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);
    store.clear()

    const daemons = {
        statmon: '/bin/statmon.js',
        nethack: '/bin/nethackd.js',
        rooterd: '/bin/rooterd.js',
        batchd: '/bin/batchd.js',
        shared: '/bin/shared.js',
        mattd: '/bin/mattd.js',
        trashmon: '/bin/trashmon.js'
    };

    for (const [name, path] of Object.entries(daemons)) {
        utils.log(`[init.d] => starting ${name}`);
        ns.run(path, 1);
        await ns.sleep(500);
    }
}
