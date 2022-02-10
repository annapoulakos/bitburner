import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';
let ns;

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    const services = store.getItem('services:init') || [];
    store.clear()
    store.setItem('services:init', services);

    for (const service of services) {
        utils.log(`[init.d] => starting ${service}`);
        ns.run('/bin/service.js', 1, 'start', service);
        await ns.sleep(500);
    }
}
