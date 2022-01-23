import * as utils from "/scripts/lib/utilities.js";
import {KubeConfig} from "/scripts/lib/kube-dsl.js";

const COMMANDS = {
    create: _create,
    get: _get,
    run: _run,
    delete: _delete,
    replace: _replace
};

export function autocomplete(data, args) {
    return [
        ...Object.keys(COMMANDS),
        ...data.servers
    ];
}

async function _create() {
    utils.log(`[kubectl:create] => creating new server...`);
    const PREFIX = "anna";

    ns.purchaseServer(PREFIX, 8);
}

async function _get() {
    const server = ns.args[0];
    utils.log(`[kubectl:get] => retrieving analytics for ${server}`);
}

async function _run() {
    const script = ns.args[0];
    utils.log(`[kubectl:run] => running configuration ${script}`);
    let config = KubeConfig.Factory(ns, script);

    utils.log(`[kubectl:run] => building servers...`);
    for (let x = 0; x < config.servers; x++) {
        ns.purchaseServer(`${config.prefix}-${x}`, config.ram);
    }

    utils.log(`[kubectl:run] => copying required files...`);
    let servers = ns.getPurchasedServers();
    for (const server of servers) {
        if (server.startsWith(config.prefix)) {
            utils.log(`[kubectl:run] => copying files from home to ${server}`);
            await ns.scp(config.scripts, "home", server);
        }
    }

    utils.log(`[kubectl:run] => starting servers...`);
    for (const server of servers) {
        if (server.startsWith(config.prefix)) {
            for (const filename of config.run) {
                ns.exec(filename, server, 1);
            }
        }
    }
}

async function _delete() {
    let servers = [];
    if (ns.args[0] == 'all') {
        servers = ns.getPurchasedServers();
    } else {
        servers = [ns.args[0]];
    }

    utils.log(`[kubectl:delete] => deleting ${servers}`);
    servers.forEach(server => ns.deleteServer(server));
}

async function _replace() {
    const server = ns.args[0],
          size = ns.args[1];

    utils.log(`[kubectl:replace] => updating ${server} to ${size}`);
    // TODO: get list of all currently running scripts on server
    // TODO: kill all scripts on server
    // TODO: delete server
    // TODO: create new server with updated size
    // TODO: re-execute all scripts that were running on server
}





let ns;
export async function main(_ns) {
    ns = _ns;
    utils.configure(ns);

    const command = ns.args.shift(),
          fn = COMMANDS[command];

    await fn();
}
