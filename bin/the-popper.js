/** @param {NS} ns **/
export async function main(ns) {
    const servers = await ns.read('/data/server-rootable-list.txt').split(',').filter(x=>x),
          hacks = [ns.brutessh, ns.ftpcrack, ns.relaysmtp, ns.httpworm, ns.sqlinject];

    ns.tprint(servers);
    servers.forEach(server => {
        hacks.forEach(hack => { try { hack(server); } catch {}});
        ns.nuke(server);
    });
}
