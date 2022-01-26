/** @param {NS} ns **/
export async function main(ns) {
    const limit = ns.getPurchasedServerLimit();
    const count = ns.getPurchasedServers().length;
    const purchase = limit - count;

    const size = ns.args[0];

    ns.tprint(`*** Purchasing ${purchase} servers ***`)
    for (const x = 1; i < purchase; x++) {
        ns.purchaseServer('dc', size);
    }

}
