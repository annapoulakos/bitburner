import * as utils from '/lib/utilities.js';
import * as store from "/lib/store.js";

let ns;

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

    store.setItem('hosts', v);
    await ns.sleep(0);
}

async function _updateRooted() {
    utils.log('[statmon] => updating rooted server list');
    const hosts = store.getItem('hosts'),
          rooted = hosts.filter(host => ns.hasRootAccess(host));

    store.setItem('rooted', rooted);
    await ns.sleep(0);
}

async function _updateBackdoors() {
    utils.log('[statmon] => updating backdoored server list');
    const hosts = store.getItem('hosts'),
          backdoors = hosts.filter(host => {
              const s = ns.getServer(host);
              return s.backdoorInstalled;
          });

    store.setItem('backdoors', backdoors);
    await ns.sleep(0);
}

async function _updateTargets() {
    utils.log('[statmon] => updating target server list');
    const hosts = store.getItem('hosts'),
          rooted = store.getItem('rooted'),
          HL = ns.getHackingLevel(),
          targets = hosts.filter(host => !rooted.includes(host)).filter(host => HL >= ns.getServerRequiredHackingLevel(host));

    store.setItem('targets', targets);
    await ns.sleep(0);
}

async function _updateServerAttributes() {
    utils.log(`[statmon] => updating server attributes`);
    const hosts = store.getItem('hosts');

    for (const host of hosts) {
        const ram = ns.getServerMaxRam(host),
              money = ns.getServerMaxMoney(host),
              skill = ns.getServerRequiredHackingLevel(host);

        store.setItem(`${host}:ram`, ram);
        store.setItem(`${host}:money`, money);
        store.setItem(`${host}:skill`, skill);
        await ns.sleep(0);
    }
}

async function _updateHostAttributes() {
    utils.log(`[statmon] => updating host attributes`);
    const cash = ns.getServerMoneyAvailable('home'),
          ram = ns.getServerMaxRam('home');

    store.setItem('home:ram', ram);
    store.setItem('home:money', cash);
    await ns.sleep(0);
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
        await _updateHostAttributes();

        await ns.sleep(500);
    }
}
