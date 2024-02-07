const SLEEP_DELAY_MS = 1000;

/** @param {NS} ns **/
export async function main(ns) {
    const server = ns.args[0],
          threads = ns.args[1];

    const files = [
        "/bin/_hack.js",
        "/bin/_weaken.js",
        "/bin/_grow.js",
        "/bin/_weaken.js"
    ];

    let step = 0;
    while (true) {
        const growTime = ns.getGrowTime(server) + SLEEP_DELAY_MS,
              weakenTime = ns.getWeakenTime(server) + SLEEP_DELAY_MS,
              hackTime = ns.getHackTime(server) + SLEEP_DELAY_MS,
              timers = [hackTime, weakenTime, growTime, weakenTime];

        ns.exec(files[step%4], server, threads, server);

        await ns.sleep(timers[step%4]);
        step = (step + 1) % 4;
    }
}