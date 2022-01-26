/**
 * @param {NS} ns
 * @param {string} server
**/
export async function prep(ns, server) {
    const file_list = [
        "ali-baba.js",
        "fuck.js",

        "/lib/food.js",
        "/lib/juvenile.js",
        "/lib/zerglings.js",

        "/lib/grow.js",
        "/lib/hack.js",
        "/lib/weaken.js",
    ];

    await ns.scp(file_list, "home", server);
}
