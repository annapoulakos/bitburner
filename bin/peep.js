import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

let ns;

export function autocomplete(data, args) {
    return [
        ...data.servers
    ];
}


/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    const files = ns.ls('home').filter(fn => fn.startsWith('/archived-scripts'));

    files.forEach(file => ns.rm(file));
}
