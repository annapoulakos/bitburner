/** @param {NS} ns **/
export async function main(ns) {
    await ns.scp(["/lib/weaken.js", "/lib/hack.js", "/lib/grow.js"], "home", "us-east-1");
    const server = ns.args[0],
          growTime = ns.getGrowTime(server),
          weakenTime = ns.getWeakenTime(server),
          growRatio = 1.0 + (ns.getServerMoneyAvailable(server), ns.getServerMaxMoney(server)),
          growThreads = (ns.growthAnalyze(server, growRatio)|0) + 1;

    ns.tprint(`GROWING: ${server}`)
    ns.exec("/lib/grow.js", "us-east-1", growThreads, server);
    await ns.sleep(growTime + 5000);

    ns.tprint(`WEAKENING: ${server}`);
    ns.exec("/lib/weaken.js", "us-east-1", growThreads, server);
    await ns.sleep(weakenTime + 5000);
}
