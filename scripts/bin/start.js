import * as utils from "/scripts/lib/utilities.js";
import {Security} from "/scripts/lib/security.js";

const SLEEP_DELAY_MS = 30000,
      THREAD_POOL = 1;

let ns = null;

function _stats() {
    utils.log(`[start:statistician] => running statistician`);
    ns.run('/scripts/bin/statistician.js', 1, '--silent');
}

function _getProduction() {
    utils.log(`[start:getProduction] => generating hacknet production values`);
    const nodes = ns.hacknet.numNodes();
    let  cost = 0;
    for (let i=0; i<nodes; i++) {
        const stats = ns.hacknet.getNodeStats(i);
        cost += stats.production;
    }
    return cost;
}

function _crackTargets() {
    utils.log(`[start:cracking] => cracking available targets`);
    _stats();

    const security = new Security(ns),
          targets = ns.read('/data/statistician.targets.txt').split(',')

    for (const target of targets) {
        utils.log(`[start:cracking] => cracking ${target}`);
        try { security.crack(target); } catch {}
    }
}

async function _phase1() {
    utils.log(`[start::phase-1] => starting phase 1`);
    let hackingLevel = 0,
        hacknetProduction = 0,
        working = true;

    while (working) {
        if (!ns.isRunning("/bin/hacknet.js", "home", "--maxprod", 10000)) {
            utils.log(`[start::phase-1] => building hacknet to 10k/s`);
            ns.run("/bin/hacknet.js", 1, "--maxprod", 10000);
        }

        _crackTargets();

        _stats();
        let targets = ns.read('/data/statistician.rooted.txt').split(',');
        targets.forEach(target => {
            if (!target) return;
            if (ns.isRunning("/bin/batch-remote.js", "home", target, THREAD_POOL)) return;
            utils.log(`[start::phase-1] => batching ${THREAD_POOL} threads for ${target}`);
            ns.run('/bin/batch-remote.js', 1, target, THREAD_POOL);
        });

        hackingLevel = ns.getHackingLevel();
        hacknetProduction = _getProduction();
        if (hackingLevel > 700 && hacknetProduction > 10000) {
            working = false;
            utils.log(`[start::phase-1] => completed`);
        } else {
            utils.log(`[start::phase-1] => Hacking: ${hackingLevel}/300 -- Hacknet: ${hacknetProduction.toFixed(2)}/10000`);
            await ns.sleep(SLEEP_DELAY_MS);
        }
    }
}

async function _phase2() {
    utils.log(`[start::phase-2] => starting phase 2`);
    let hackingLevel = 0,
        hacknetProduction = 0,
        working = true;

    while (working) {
        if (!ns.isRunning("/bin/hacknet.js", "home")) {
            utils.log(`[start::phase-2] => update hacknet to 500k/sec`);
            ns.run('/bin/hacknet.js', 1);
        }

        _crackTargets();

        _stats();
        let targets = ns.read('/data/statistician.rooted.txt').split(',');
        targets.forEach(target => {
            if (!target) return;
            if (ns.isRunning("/bin/batch-remote.js", "home", target, THREAD_POOL)) return;
            utils.log(`[start::phase-1] => batching ${THREAD_POOL} threads for ${target}`);
            ns.run('/bin/batch-remote.js', 1, target, THREAD_POOL);
        });

        hackingLevel = ns.getHackingLevel();
        hacknetProduction = _getProduction();
        if (hackingLevel > 1000 && hacknetProduction > 500000) {
            working = false;
            utils.log(`[start::phase-2] => completed`);
        } else {
            utils.log(`[start::phase-2] => Hacking: ${hackingLevel}/700 -- Hacknet: ${hacknetProduction.toFixed(2)}/500000`);
            await ns.sleep(SLEEP_DELAY_MS);
        }
    }
}

export async function main(_ns) {
    utils.configure(_ns);
    ns = _ns;

    await _phase1();
    await _phase2();
}
