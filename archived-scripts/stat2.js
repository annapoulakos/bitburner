function getThreads(ns, server, size) {
	const t = ns.getServerMaxRam(server),
          u = ns.getServerUsedRam(server);
	return ((t-u) / size)|0;
}

/** @param {NS} ns **/
export async function main(ns) {
    ns.tprint('*** GROWTH ANALYSIS ***');
    const server = ns.args[0];

    const growTime = ns.getGrowTime(server);
    const growRatio = 1.0 + (ns.getServerMoneyAvailable(server) / ns.getServerMaxMoney(server));
    const growThreads = (ns.growthAnalyze(server, growRatio)|0) + 1;
    const growSecurity = ns.growthAnalyzeSecurity(growThreads);
    const threadCycles = growThreads / getThreads(ns, server, 1.8);

    ns.tprint(`execution time    -> ${growTime}`);
    ns.tprint(`total threads     -> ${growThreads}`);
    ns.tprint(`security increase -> ${growSecurity}`);
    ns.tprint(`thread cycles     -> ${threadCycles}`);

    ns.tprint('*** WEAKEN ANALYSIS ***');

    const weakenTime = ns.getWeakenTime(server);
    const weakenAmount = ns.getServerSecurityLevel(server) - ns.getServerMinSecurityLevel(server) + growSecurity;
    const weakenEffect = ns.weakenAnalyze(1);
    const weakenRatio = weakenAmount / weakenEffect;

    ns.tprint(`ratio -> ${weakenRatio}`);
    ns.tprint(`effect -> ${weakenEffect}`);
    ns.tprint(`amount -> ${weakenAmount}`);
    ns.tprint(`time -> ${weakenEffect * weakenTime}`)
}
