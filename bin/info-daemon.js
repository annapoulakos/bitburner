import * as utils from '/scripts/lib/utilities.js';

let localStorage = globalThis['window'].localStorage;
let ns;



async function _buildGraph() {
    let v = [], t = ['home'], p = ns.getPurchasedServers();
    p.push('home');
    p.push('darkweb');

    while (t && t.length) {
        const c = t.shift(), nts = ns.scan(c); v.push(c);
        nts.forEach(nt => {if (!v.includes(nt) && !t.includes(nt)) {t.push(nt);}});
    }
    v = v.filter(e => !p.includes(e));

    localStorage.setItem('hosts', v);
}

async function _updateAll() {
    const hosts = localStorage.getItem('hosts');

    hosts.forEach(host => {
        const server = ns.getServer(host);
        localStorage.setItem(host, {
            backdoorInstalled: server.backdoorInstalled,
            hasAdminRights: server.hasAdminRights,
            numOpenPortsRequired: server.numOpenPortsRequired,
            portsOpen: {
                ssh: server.sshPortOpen,
                ftp: server.ftpPortOpen,
                smtp: server.smtpPortOpen,
                http: server.httpPortOpen,
                sql: server.sqlPortOpen
            },
            requiredHackingSkill: server.requiredHackingSkill,
            moneyMax: server.moneyMax,
            maxRam: server.maxRam,
            minDifficulty: server.minDifficulty
        });
    });
}

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    utils.log('[info-daemon:main] => configuring startup and listeners');
    await _buildGraph();

    while (true) {
        _updateAll();

        await ns.sleep(5000);
    }
}
