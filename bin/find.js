/** @param {NS} ns **/
export async function main(ns) {
    const servers = await ns.read("/data/server-complete-list.txt").split(','),
          search = ns.args[0];


    if (search == 'lit') {
        for (const server of servers) {
            const list = await ns.ls(server),
                  filtered = list.filter(x => x.endsWith(search));

            ns.tprint(filtered);
            if (filtered.length) {
                await ns.scp(filtered, server, "home");
            }
        }
    } else if (search == 'cct') {
        for (const server of servers) {
            const list = await ns.ls(server),
                  filtered = list.filter(x => x.endsWith(search));

            if (filtered.length) {
                ns.tprint(`[${server}] => ${filtered}`);
            }
        }
    }

}
