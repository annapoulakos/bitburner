/** @param {NS} ns **/
export async function main(ns) {
    ns.tprint('*** batching piece ***');
    const servers = await ns.read('/data/server-root-list.txt').split(',');

    const skippable_servers = [
        'home',
        'darkweb',
        '.',
        ""
    ];
    servers.forEach(server => {
        if (skippable_servers.includes(server)) { return; }
        ns.tprint(`[${server}] => checking server stats`);

        const mem = ns.getServerMaxRam(server),
              threads = (mem / 1.8) |0;
        if (!ns.isRunning('/bin/batch-this.js', 'home', server, threads)) {
            ns.tprint(`[${server}] => batching on ${threads} threads...`);
            ns.run('/bin/batch-this.js', 1, server, threads);
        }
    });
}
