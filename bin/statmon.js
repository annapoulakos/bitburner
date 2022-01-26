import * as utils from '/scripts/lib/utilities.js';
import * as store from "/scripts/lib/store.js";

let ns;

export function autocomplete(data, args) {
    return [
        'new', 'update'
    ];
}

async function _buildGraph() {
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
    const hosts = store.get('hosts'),
          rooted = hosts.filter(host => ns.hasRootAccess(host));

    store.set('rooted', rooted);
    await ns.sleep(0);
}

async function _updateBackdoors() {
    const hosts = store.get('hosts'),
          backdoors = hosts.filter(host => {
              const s = ns.getServer(host);
              return s.backdoorInstalled;
          });

    store.set('backdoors', backdoors);
    await ns.sleep(0);
}

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    if (ns.args[0] == 'new') {
        await _buildGraph();
    } else if (ns.args[0] == 'update') {
        await _updateRooted();
        await _updateBackdoors();
    }
}
