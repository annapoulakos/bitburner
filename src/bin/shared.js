//import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

const SHARE_SLEEP_MS = 10200,
      SHARE_EXECUTOR_GB = 4.01;

let ns;

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
		
    const hostname = ns.getHostname();
    let maxShare = store.getItem(`${hostname}:share`);

    if (maxShare == null) {
        store.setItem(`${hostname}:share`, 0.25);
        maxShare = 0.25;
    }


    while (true) {
        maxShare = store.getItem(`${hostname}:share`);
        const threads = ((store.getItem(`${hostname}:ram`)*maxShare)/SHARE_EXECUTOR_GB)|0;
        ns.exec('/bin/_share.js', hostname, threads);
        await ns.asleep(SHARE_SLEEP_MS);
    }
}