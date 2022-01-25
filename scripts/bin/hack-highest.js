import * as utils from '/scripts/lib/utilities.js';

let ns;

async function _getServerList() {
    utils.log(`[hack-highest:getServerList] => generated list of rooted servers`);
    ns.run('/scripts/bin/statistician.js');
    await ns.sleep(1);
    const deter = ['home', 'darkweb', '.'];
    return ns.read('/data/statistician.rooted.txt').split(',').map(s => s).filter(s => !deter.includes(s));
}

function _getBestServer(servers) {
    utils.log(`[hack-highest:getBestServer] => finding best server (most max money)`);
    let serverInfo = {};
    for (const server of servers) {
        utils.log(`[hack-higest:getbestserver] => server: ${server}`);
        serverInfo[server] = ns.getServerMaxMoney(server);
    }

    return Object.keys(serverInfo).reduce((a,b) => serverInfo[a]>serverInfo[b]? a: b);
}

function _executeBatch(server) {
    utils.log(`[hack-highest:executeBatch] => starting batch on ${server}`);
    const host = ns.getHostname(),
          threads = ((ns.getServerMaxRam(host) / 4) * 0.9)|0;
    ns.exec('/scripts/bin/batch-remote.js', host, 1, server, threads);
}

/**
 *
 * @param {NS} _ns
 */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    const servers = await _getServerList(),
          bestServer = _getBestServer(servers);

    utils.log(`[hack-highest:main] => ${bestServer}`);
    _executeBatch(bestServer);
}
