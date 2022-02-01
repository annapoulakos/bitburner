import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

let ns;

export function autocomplete(data, args) {
    return [
        ...data.servers
    ];
}

function _calculateThreadsPerServer (hostMem) {
    const hostMemGoal = hostMem * MAX_RAM_IN_USE,
          inUse = MAX_SERVERS * BATCHING_RAM_REQ,
          available = hostMemGoal - inUse,
          threadCost = MAX_SERVERS * FUNCTION_RAM_REQ,
          threads = (available / threadCost)|0;

    return threads;
}

function _generateServerList() {
    const rooted = store.getItem('rooted');
    let targets = [];
    for (const host of rooted) {
        targets.push({
            host: host,
            money: store.getItem(`${host}:money`)
        });
    }

    targets = targets.sort((a,b) => b.money-a.money);
    return targets.slice(0,10);
}

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    const server = ns.args[0],
          serverRam = store.getItem(`${server}:ram`),
          hosts = _generateServerList();

    let lines = [
        server,
        `max ram: ${serverRam}`
    ];

    for (const host of hosts) {
        const money = ns.nFormat(host.money, "0,0");
        lines.push(`${host.host} => ${money}`);
    }

    lines.forEach(line => utils.log(`[peep] => ${line}`));
}
