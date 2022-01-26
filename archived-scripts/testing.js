// import * as mutex from "lib/mutex.js";

/** @param {NS} ns **/
export async function main(ns) {
    // await mutex.lock(ns, ns.args[0], async () => {
    //     ns.tprint(`inside function for ${ns.args[0]}`)

    //     await ns.asleep(5);
    //     ns.tprint(`finished with ${ns.args[0]}`);
    // });
    const servers = [
        'anna-east-1',
        'anna-east-2',
    ];

    servers.forEach(server => ns.deleteServer(server));
}
