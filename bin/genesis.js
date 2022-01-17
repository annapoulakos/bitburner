/** @param {NS} ns **/
export async function main(ns) {
    // TODO: Execute hand-of-joshua -> take down all available walls
    // TODO: Execute little-chef -> install scripts on all available servers
    // TODO: Execute smooth-criminal -> run batch scripts against available servers


    ns.run("/bin/hand-of-joshua.js", 1);
    ns.run("/bin/the-popper.js", 1);
    ns.run("/bin/batching-algo.js", 1);
}
