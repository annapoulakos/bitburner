import * as utils from '/scripts/lib/utilities.js';

const localStorage = globalThis['window'].localStorage;
let ns, hostMem;

function _getUnrootedServers() {
    const hosts = localStorage.getItem('hosts');

    return hosts.filter(host => {
        const info = localStorage.getItem(host);
        return !info.hasAdminRights
    });
}

function _crack(target) {
    const fns = [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject];
    fns.forEach(fn => {
        try {fn(target);} catch {}
    });
}
/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    utils.log('[crack-daemon:main] => starting crack daemon...');

    while (true) {
        const targets = _getUnrootedServers(),
              level = ns.getHackingLevel();

        targets.forEach(target => {
            if (target.requiredHackingSkill > level) {
                const info = localStorage.getItem(target);
                if (info.portsOpen.length < ns.getServerNumPortsRequired(target)) {
                    _crack(target);
                }
                try {ns.nuke(target);} catch {}
            }
        });

        await ns.sleep(10000);
    }
}
