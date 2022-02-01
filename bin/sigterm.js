import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

let ns;

export function autocomplete(data, args) {
    return [

    ];
}

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    const hosts = store.getItem('rooted').concat('home');

    for (const host of hosts) {
        utils.log(`[sigterm] => killing ${ns.args[0]} on ${host}`);
        if (ns.args[0] == '*') {
            ns.killall(host);
        } else {
            ns.kill(ns.args[0], host);
        }
    }
}
