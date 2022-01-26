let _ns = null;

function _configure(ns) {
    _ns = ns;
}

function _generateGraph() {
    let visited = [], targets = ['home'];

    while (targets && targets.length) {
        const target = targets.shift(),
              new_targets = _ns.scan(target);
        visited.push(target);
        for (const nt of new_targets) {
            if (!visited.includes(nt) && !targets.includes(nt)) { targets.push(nt); }
        }
    }
    return visited
}

async function _ensureHosts() {
    if (!_ns.fileExists('/data/is.hosts.txt')) {
        await _ns.write('/data/is.hosts.txt', _generateGraph(), "w");
    }
}

function _output(list) {
    list.forEach(elem => _ns.tprint(elem));
}

async function _help(args) {
    const docs = await _ns.read("/data/information-services.help.txt").split("\n");

    for (const line of docs) {
        _ns.tprint(line);
    }
}
async function _list(args) {
    const visited = _generateGraph();

    for (const host of visited) {
        _ns.tprint(host);
    }

    await _ns.write("/data/is.hosts.txt", visited, "w");
}
async function _connect(args) {
    let graph = {},
        nodes = _generateGraph();

    for (const node of nodes) {
        graph[node] = _ns.scan(node);
    }

    const target = args[0],
          start = _ns.getHostname();


}
async function _listRoot(args) {
    await _ensureHosts();

    const hosts = _ns.read("/data/is.hosts.txt").split(',');
    let rooted = [];
    for (const host of hosts) {
        if (_ns.hasRootAccess(host)) {
            rooted.push(host);
        }
    }

    await _ns.write('/data/is.rooted.txt', rooted, "w");
    _output(rooted);
}
async function _listBackdoor(args) {
    await _ensureHosts();

    const hosts = _ns.read("/data/is.hosts.txt").split(',');
    let backdoors = [];

    for (const host of hosts) {
        const server = _ns.getServer(host);
        if (server.backdoorInstalled) {
            backdoors.push(host);
        }
    }

    await _ns.write("/data/is.backdoor.txt", backdoors, "w");
    _output(backdoors);
}
async function _listTargets(args) {
    await _ensureHosts();

    const hosts = _ns.read('/data/is.hosts.txt').split(',');
    let targets = [];

    for (const host of hosts) {
        const server = _ns.getServer(host),
              root = server.hasAdminRights,
              hack = server.requiredHackingSkill <= _ns.getHackingLevel();

        if (!root && hack) {
            targets.push(host);
        }
    }

    await _ns.write("/data/is.targets.txt", targets, "w");
    _output(targets);
}
async function _info(args) {
    const server = _ns.getServer(args[0]);

    for (const prop in server) {
        _ns.tprint(`[${args[0]}] ${prop} => ${server[prop]}`);
    }
}

export function autocomplete(data, args) {
    const commands = ['list', 'connect', 'list-root', 'list-backdoor', 'list-targets', 'info'];
    return [...commands, ...data.servers];
}

/**
 * Information Services entrypoint
 *    Set: alias is="run information-services.js "
 *
 * @param {NS} ns
 */
export async function main(ns) {
    _configure(ns);
    const command = ns.args.shift();

    const fn = {
        list: _list,
        connect: _connect,
        'list-root': _listRoot,
        'list-backdoor': _listBackdoor,
        'list-targets': _listTargets,
        info: _info,
    }[command] || _help;

    await fn(ns.args);
}
