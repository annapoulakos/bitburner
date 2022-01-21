import * as utils from "/scripts/lib/utilities.js";
import {Security} from "/scripts/lib/security.js";

const SLEEP_DELAY_MS = 30000;

let ns = null;

export async function main(_ns) {
    utils.configure(_ns);
    ns = _ns;

    utils.log('[start::main] => update hacknet (max prod 10,000)');
    ns.run('/bin/hacknet.js', 1, '--maxprod', 10000);

    utils.log('[start::main] => phase 1 (crack servers until 300 hacking level)');
    let hackingLevel = 0,
        phase = 1,
        security = new Security(ns);

    while (phase == 1) {
        ns.run('/scripts/bin/statistician.js', 1, '--silent');

        let targets = ns.read('/data/statistician.targets.txt').split(',');
        targets.forEach(target => security.crack(target));

        targets = ns.read('/data/statistician.rooted.txt').split(',');
        targets.forEach(target => {
            utils.log(`[start::main] => batching 20 threads for ${target}`);
            ns.run('/bin/batch-remote.js', 1, target, 20);
        });

        hackingLevel = ns.getHackingLevel();
        if (hackingLevel > 300) {
            phase = 2;
        } else {
            utils.log(`[start::main] => sleeping for ${(SLEEP_DELAY_MS/1000)|0} seconds`);
            await ns.sleep(SLEEP_DELAY_MS);
        }
    }

    utils.log('[start::main] => phase 2 (run custom servers)');

    try {
        ns.kill('/bin/hacknet.js', 'home', '--maxprod', 10000);
    } finally {
        utils.log('[start::main] => update hacknet (max prod 500,000)');
        ns.run('/bin/hacknet.js', 1);
    }

    // while (phase == 2) {


    //     hackingLevel = ns.getHackingLevel();
    //     if (hackingLevel > 1000) {
    //         phase = 3;
    //     }
    // }
}
