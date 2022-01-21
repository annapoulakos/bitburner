import * as utils from "/scripts/lib/utilities";
let ns = null;

export async function main(_ns) {
    ns = _ns;
    utils.configure(ns);

    utils.log(`[self-sign::main] -> running statitistician...`);
    ns.run('/scripts/bin/statistician.js', 1);

    const targets = ns.read('/data/statistician.rooted.txt').split(',');
    utils.log(`[self-sign::main] => found ${targets.length} targets...`);

    targets.forEach(target => {
        const mem = ns.getServerMaxRam(target),
              threads = (mem/1.80) |0;

        utils.log(`[self-sign::main] => ${target} has ${mem} Gb RAM and ${threads} available threads...`);
        if (threads == 0) { return; }
        ns.run('/bin/batch-this.js', 1, target, threads);
    });
}
