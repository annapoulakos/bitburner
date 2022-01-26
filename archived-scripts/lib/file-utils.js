/**
 * File utilities script.
 *
 * This script contains helpers to convert files into objects
 * and vice-versa.
 */

const ROOT_INFO_FILE = "/data/server-root-info.txt";
const SERVER_INFO_FILE = "/data/server-info.txt";


/**
 * @param {NS} ns
 * @param {string} server
 */
export async function loadServerBasicData(ns, server) {
    const filename = `/data/${server}.basic.txt`;
    const [skill,ports,ram,money] = ns.read(filename).split(':');

    return {
        hostname: server,
        requiredHackingSkill: parseInt(skill),
        requiredOpenPorts: parseInt(ports),
        maxRam: parseInt(ram),
        maxMoney: parseInt(money)
    };
}

/**
 * @param {NS} ns
 * @param {string} server
 * @param {*} data
 */
export async function writeServerBasicData(ns, server, data) {
    const filename = `/data/${server}.basic.txt`;
    const datastring = `${data["requiredHackingSkill"]}:${data["requiredOpenPorts"]}:${data["maxRam"]}:${data["maxMoney"]}`;

    await ns.write(filename, datastring, "w");
}


/**
 * @param {NS} ns
 * @param {string} server
 */
 export async function loadServerCurrentData(ns, server) {
    const filename = `/data/${server}.current.txt`;
    const [root,backdoor,ports] = ns.read(filename).split(':');

    let openPorts = [];
    if (ports && ports.length) {
        openPorts = ports.split('|');
    }

    return {
        hostname: server,
        hasAdminAccess: root==="true",
        backdoorInstalled: backdoor==="true",
        openPorts: openPorts
    };
}

/**
 * @param {NS} ns
 * @param {string} server
 * @param {*} data
 */
export async function writeServerCurrentData(ns, server, data) {
    const filename = `/data/${server}.current.txt`;
    const ports_string = data["openPorts"].join('|');
    const datastring = `${data["hasAdminAccess"]}:${data["backdoorInstalled"]}:${ports_string}`;

    await ns.write(filename, datastring, "w");
}


// /**
//  * @param {NS} ns
//  */
// export async function serverRootInfo(ns) {
//     ns.tprint(`-> loading data from ${ROOT_INFO_FILE}`);
//     const data = ns.read(ROOT_INFO_FILE);

//     let result = {};
//     for (const line of data.split(',')) {
//         const [server, root_access, backdoor, ports] = line.split(':');

//         let open_ports = [];
//         if (ports && ports.length) {
//             open_ports = ports.split('|');
//         }

//         result[server] = {
//             hasRootAccess: root_access==="true",
//             hasBackdoor: backdoor==="true",
//             openPorts: open_ports
//         }
//     }

//     return result;
// }

// /** @param {NS} ns **/
// export async function serverBasicInfo(ns) {
//     ns.tprint(`-> loading data from ${SERVER_INFO_FILE}`);
//     const data = ns.read(SERVER_INFO_FILE).split(',');
//     let result = {};

//     for (const line of data) {
//         const [server, hacking_level, num_ports, maxRam, maxMoney] = line.split(':');

//         result[server] = {
//             requiredHackingLevel: parseInt(hacking_level),
//             requiredOpenPorts: parseInt(num_ports),
//             maxRam: parseInt(maxRam),
//             maxMoney: parseInt(maxMoney)
//         };
//     }

//     return result;
// }
