import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

const SLEEP_DELAY_MS = 60000;
let ns;

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    store.setItem('trashmon:filter', ['/delete']);

    while (true) {
        const filter = store.getItem('trashmon:filter'),
              files = ns.ls(ns.getHostname());

        for (const file of files) {
            if (filter.some((e,i,a) => file.startsWith(e))) {
                ns.rm(file);
            }
        }

        await ns.sleep(SLEEP_DELAY_MS);
    }
}
