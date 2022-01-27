import * as utils from '/scripts/lib/utilities.js';
import * as store from "/scripts/lib/store.js";

let ns;

export function autocomplete(data, args) {
    return [
        'new', 'update'
    ];
}

async function _buildGraph() {
    utils.log('[statmon] => updating source server list');
    let v = [], t = ['home'], p = ns.getPurchasedServers();
    p.push('home');
    p.push('darkweb');

    while (t && t.length) {
        const c = t.shift(), nts = ns.scan(c); v.push(c);
        nts.forEach(nt => {if (!v.includes(nt) && !t.includes(nt)) {t.push(nt);}});
    }
    v = v.filter(e => !p.includes(e));

    store.set('hosts', v);
    await ns.sleep(0);
}

async function _updateRooted() {
    utils.log('[statmon] => updating rooted server list');
    const hosts = store.get('hosts'),
          rooted = hosts.filter(host => ns.hasRootAccess(host));

    store.set('rooted', rooted);
    await ns.sleep(0);
}

async function _updateBackdoors() {
    utils.log('[statmon] => updating backdoored server list');
    const hosts = store.get('hosts'),
          backdoors = hosts.filter(host => {
              const s = ns.getServer(host);
              return s.backdoorInstalled;
          });

    store.set('backdoors', backdoors);
    await ns.sleep(0);
}

async function _updateTargets() {
    utils.log('[statmon] => updating target server list');
    const hosts = store.get('hosts'),
          rooted = store.get('rooted'),
          HL = ns.getHackingLevel(),
          targets = hosts.filter(host => !rooted.includes(host)).filter(host => HL >= ns.getServerRequiredHackingLevel(host));

    store.set('targets', targets);
    await ns.sleep(0);
}

async function _updateServerAttributes() {
    utils.log(`[statmon] => updating server attributes`);
    const hosts = store.get('hosts');

    for (const host of hosts) {
        const ram = ns.getServerMaxRam(host),
              money = ns.getServerMaxMoney(host);

        store.set(`${host}:ram`, ram);
        store.set(`${host}:money`, money);
        await ns.sleep(0);
    }
}

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    await _buildGraph();
    await _updateServerAttributes();

    while (true) {
        await _updateRooted();
        await _updateBackdoors();
        await _updateTargets();


        await ns.sleep(500);
    }
}
