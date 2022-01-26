import * as utils from "lib/file-utils.js";

/** @param {NS} ns **/
export async function main(ns) {
    ns.tprint('*** executing horn-of-joshua.js ***');
    ns.tprint('-> generating node graph...')
    let visited = [],
        targets = ['home'];

    while (targets && targets.length) {
        const target = targets.shift();

        ns.tprint(`-> visiting ${target}`);
        visited.push(target);

        const new_targets = ns.scan(target);
        ns.tprint(`-> [${target}] found ${new_targets.length} connections`)

        for (const nt of new_targets) {
            if (!visited.includes(nt) && !targets.includes(nt)) { targets.push(nt); }
        }

        ns.tprint(`-> ${targets.length} targets remaining`);
    }

    await ns.write("/data/server-complete-list.txt", visited, "w");

    ns.tprint('-> generating server information datastore...');
    let rooted = [], rootable = [], noram = [];
    for (const s of visited) {
        const server = ns.getServer(s);

        // Generate base server information
        // DSL => HACKING_SKILL:NUM_PORTS:RAM:MAX_MONEY
        await utils.writeServerBasicData(ns, server.hostname,{
            requiredHackingSkill: server.requiredHackingSkill,
            requiredOpenPorts: server.numOpenPortsRequired,
            maxRam: server.maxRam,
            maxMoney: server.moneyMax
        });

        // Generate current server information
        // DSL => HAS_ROOT:HAS_BACKDOOR:PORT_LIST
        const ports = [
                (server.sshPortOpen)?'ssh':'',
                (server.ftpPortOpen)?'ftp':'',
                (server.smtpPortOpen)?'smtp':'',
                (server.httpPortOpen)?'http':'',
                (server.sqlPortOpen)?'sql':''
            ];
        await utils.writeServerCurrentData(ns, server.hostname,{
            hasAdminAccess: server.hasAdminRights,
            backdoorInstalled: server.backdoorInstalled,
            openPorts: ports.filter(x=>x)
        });

        if (server.hasAdminRights && !['home', 'darkweb', '.'].includes(server.hostname)) {
            rooted.push(server.hostname);
        }

        if (!server.hasAdminRights && !['home', 'darkweb', '.'].includes(server.hostname)) {
            if (ns.getHackingLevel() >= server.requiredHackingSkill) { rootable.push(server.hostname); }
        }

        if (server.maxRam == 0) {
            noram.push(server.hostname);
        }
    }

    await ns.write("/data/server-root-list.txt", rooted, "w");
    await ns.write('/data/server-rootable-list.txt', rootable, "w");
    await ns.write('/data/server-noram-list.txt', noram, 'w');

    ns.tprint(`-> ${visited.length} total available targets`);
    ns.tprint(`*** good-bye ***`);
}
