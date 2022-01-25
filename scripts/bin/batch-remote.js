const SLEEP_DELAY_MS = 1000;

/** @param {NS} ns **/
export async function main(ns) {
    const server = ns.args[0],
          threads = ns.args[1],
          files = ['/lib/grow.js', '/lib/weaken.js', '/lib/hack.js', '/lib/weaken.js'];

    let step = 0;
    while (true) {
        const growTime = ns.getGrowTime(server) + SLEEP_DELAY_MS,
              weakenTime = ns.getWeakenTime(server) + SLEEP_DELAY_MS,
              hackTime = ns.getHackTime(server) + SLEEP_DELAY_MS,
              timers = [growTime, weakenTime, hackTime, weakenTime];

        ns.run(files[step], threads, server);

        await ns.sleep(timers[step]);
        step = (step + 1) % 4;
    }
}
