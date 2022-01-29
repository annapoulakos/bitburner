import * as utils from '/scripts/lib/utilities.js';
import * as store from '/scripts/lib/store.js';

const SHARE_SLEEP_MS = 10200,
      SHARE_EXECUTOR_GB = 4.01;

let ns;

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    utils.log('[shared] => loading configuration');
    const hostname = ns.getHostname();
    let maxShare = store.getItem(`${hostname}:share`);

    if (maxShare == null) {
        store.setItem(`${hostname}:share`, 0.25);
        maxShare = 0.25;
    }

    const threads = ((ns.getServerMaxRam(hostname)*maxShare)/SHARE_EXECUTOR_GB)|0;

    while (true) {
        ns.exec('/bin/_share.js', hostname, threads);
        await ns.sleep(SHARE_SLEEP_MS);
    }
}
