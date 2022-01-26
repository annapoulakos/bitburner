import * as utils from "/lib/file-utils.js";

const SLEEP_DELAY_MS = 60000;

/** @param {NS} ns **/
export async function main(ns) {
    const server = ns.args[0],
        fn_list = [ns.brutessh, ns.ftpcrack, ns.httpworm, ns.relaysmtp, ns.sqlinject],
        serverBasicInfo = await utils.loadServerCurrentData(ns, server);

    let currentServerInfo = await utils.loadServerCurrentData(ns, server),
        rootAccess = currentServerInfo['hasAdminAccess'];

    while (!rootAccess) {
        if (ns.getHackingLevel() >= serverBasicInfo["requiredHackingSkill"]) {
            fn_list.forEach(fn => {try {fn(server);} catch {}});

            try {
                ns.nuke(server);
            } catch {}
        }

        rootAccess = ns.hasRootAccess(server);
        if (!rootAccess) {
            await ns.sleep(SLEEP_DELAY_MS);
        }
    }

    if (!currentServerInfo['hasAdminAccess']) {
        currentServerInfo['hasAdminAccess'] = true;

        // TODO: get open port list

        await utils.writeServerCurrentData(ns, server, currentServerInfo);
    }
}
