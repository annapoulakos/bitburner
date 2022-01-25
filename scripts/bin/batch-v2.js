/**
    * @param {NS} ns
    */
export async function main(ns) {
    const mem = ns.getServerMaxRam(ns.args[0]),
          threads = (((mem/4)*0.95)/2)|0,
          exec = ns.exec
          wtime = ns.getWeakenTime;
    while (true) {
        let weakenTime = wtime(ns.args[0]);

        exec('/bin/grow.js', threads);
        exec('/bin/weaken.js', threads);
        await ns.sleep(weakenTime + 200);

        weakenTime = wtime(ns.args[0]);
        exec('/bin/hack.js', threads);
        exec('/bin/weaken.js', threads);
        await ns.sleep(weakenTime + 200);
    }
}
