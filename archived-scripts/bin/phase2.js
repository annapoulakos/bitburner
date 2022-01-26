// import * as utils from "/lib/utils.js";

const FILES = [
    '/lib/grow.js',
    '/lib/weaken.js',
];

const FLAGS = [
    ['server', 'anna-east-1'],
];

const SLEEP_DELAY_MS = 2000;

/**
 * @param {NS} ns
 */
export async function main(ns) {
    // utils.configure(ns, FLAGS);

    const logs = [
        'disableLog',
        'getServerMoneyAvailable',
        'getPurchasedServers',
        'getPurchasedServerCost',
        'purchaseServer',
        'killall',
        'getServerMaxRam',
        'scp',
        'kill',
        'getServerMaxMoney',
        'getServerMinSecurityLevel',
        'getGrowTime',
        'getWeakenTime',
        'getServerSecurityLevel',
        'exec',
        'sleep'
    ];
    logs.forEach(log => ns.disableLog(log));

    const target = ns.args[0],
          flags = ns.flags(FLAGS);

    let server_name = flags['server'];
    if (!ns.getPurchasedServers().includes(server_name)) {
        if (ns.getServerMoneyAvailable('home') < ns.getPurchasedServerCost(512)) {
            ns.tprint(`[phase2:main] => not enough funds for server`)
            ns.exit();
        }

        server_name = ns.purchaseServer(server_name, 512);
    }

    if (!server_name || server_name != flags['server']) {
        ns.tprint(`[phase2:main] => error generating server, got ${server_name}`);
        ns.exit();
    }

    await ns.scp(FILES, 'home', server_name);

    ns.print(`[phase2] => killing all scripts on ${server_name}`);
    ns.killall(server_name);
    ns.print(`[phase2] => killing all scripts on ${target}`);
    ns.killall(target);

    // MUST KILL THE EXISTING BATCHING SCRIPT. hopefully...
    const m = ns.getServerMaxRam(target),
          t = (m/1.8) |0;
    ns.print(`[phase2] => killing batcher for ${target} (t:${t})`);
    ns.kill('/bin/batch-this.js', 'home', target, t);

    let finished = false,
        growCount = 0,
        weakenCount = 0,
        cycles = 0;
    const mem = ns.getServerMaxRam(server_name),
          max_money = ns.getServerMaxMoney(target),
          min_security = ns.getServerMinSecurityLevel(target);

    while (!finished) {
        const growTime = ns.getGrowTime(target)+SLEEP_DELAY_MS,
              weakenTime = ns.getWeakenTime(target)+SLEEP_DELAY_MS,
              threads = (mem / 1.8) |0;

        const currentMoney = ns.getServerMoneyAvailable(target),
              currentSecurity = ns.getServerSecurityLevel(target),
              maxMoney = max_money == currentMoney,
              minSecurity = min_security == currentSecurity;

        ns.print(`[money] => ${currentMoney|0} / ${max_money}`);
        ns.print(`[security] => ${currentSecurity.toFixed(2)} / ${min_security}`);

        if (!maxMoney) {
            ns.print(`[grow.js] => ${threads} threads on ${server_name}`);
            ns.exec('/lib/grow.js', server_name, threads, target);
            ns.print(`[grow.js] => sleep ${(growTime/1000).toFixed(2)}`);
            growCount++;
            await ns.sleep(growTime);
        }

        if (!minSecurity) {
            ns.print(`[weaken.js] => ${threads} threads on ${server_name}`);
            ns.exec('/lib/weaken.js', server_name, threads, target);
            ns.print(`[weaken.js] => sleep ${(weakenTime/1000).toFixed(2)}`);
            weakenCount++;
            await ns.sleep(weakenTime);
        }

        finished = maxMoney && minSecurity;
        cycles++;
    }

        ns.print(`[phase2] => total cycles ${cycles} (grow:${growCount} -- weaken:${weakenCount})`)
    ns.exec('/bin/batching-algo.js', 'home', 1);
}
