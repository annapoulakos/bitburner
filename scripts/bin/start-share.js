import * as utils from '/scripts/lib/utilities.js';

let ns;

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    const host = ns.getHostname(),
          max_ram = ns.getServerMaxRam(host),
          threads = (((max_ram*0.9)/4)|0);

    utils.log(`[share:main] => starting ${threads} on ${host}`);
    ns.exec("/scripts/bin/share.js", host, threads);
}
