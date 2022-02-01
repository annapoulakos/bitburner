import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

const MAX_SERVERS = 10,
      MAX_RAM_IN_USE = 0.50,
      BATCHING_RAM_REQ = 3.05,
      FUNCTION_RAM_REQ = 1.75;

let ns;

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
    return targets.slice(0,MAX_SERVERS);
}

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    const host = ns.getHostname(),
          hostMem = store.getItem(`${host}:ram`);
    if (!hostMem || hostMem < 45) {
        utils.log('[herod] => host does not have enough memory');
    }

    const MAX_THREADS = _calculateThreadsPerServer(hostMem),
          servers = _generateServerList();


    for (const server of servers) {
        utils.log(`[herod] => ${host} executing batch against ${server.host} with ${MAX_THREADS} threads`);
        ns.exec('/bin/batchLocal.js', host, 1, server.host, MAX_THREADS);
    }
}
