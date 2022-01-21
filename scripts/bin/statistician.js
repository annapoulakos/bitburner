import * as utils from "/scripts/lib/utilities.js";

let ns = null;

async function _buildGraph() {
    utils.log('[statistician::_buildGraph] => generating graph...')
    let visited = [],
        targets = ['home'];

    const purchased = ns.getPurchasedServers();
    purchased.push('home');
    purchased.push('darkweb');

    while (targets && targets.length) {
        const target = targets.shift(),
              new_targets = ns.scan(target);

        visited.push(target);

        new_targets.forEach(nt => {
            if (!visited.includes(nt) && !targets.includes(nt)) { targets.push(nt); }
        });
    }

    visited = visited.filter(elem => !purchased.includes(elem));
    utils.log(`[statistician::_buildGraph] => found ${visited.length} nodes`);

    await ns.write("/data/statistician.graph.txt", visited, "w");
    return visited;
}

/**
 * @param {NS} _ns
 */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    utils.log('[statistician::main] => loading nodes...');
    let nodes = ns.fileExists('/data/statistician.graph.txt')?
        ns.read('/data/statistician.graph.txt').split(','):
        await _buildGraph();

    let rooted = [], backdoor = [], targets = [];
    nodes.forEach(node => {
        utils.log(`[statistician::main] => loading data for ${node}`);
        const server = ns.getServer(node);
        if (server.hasAdminRights) { rooted.push(server.hostname); }
        if (server.backdoorInstalled) { backdoor.push(server.hostname); }
        if (!server.hasAdminRights && ns.getHackingLevel() >= server.requiredHackingSkill) { targets.push(server.hostname); }
    });

    utils.log('[statistician::main] => writing data files...');
    await ns.write('/data/statistician.rooted.txt', rooted, "w");
    await ns.write('/data/statistician.backdoor.txt', backdoor, "w");
    await ns.write('/data/statistician.targets.txt', targets, "w");
}
