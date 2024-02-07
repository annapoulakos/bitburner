import * as store from '/lib/store.js';

let ns;

const FN_MAP = {
    config: _config,
    cluster: _cluster,
    refresh: _refresh,
    'reset-config': _defaultConfig
};

const FLAGS = [
    ['items', []],
    ['up', false],
    ['down', false],
    ['deploy', 'share'],
    ['l', false]
];

const ALLOWED_CONFIG_ITEMS = [
    'hosts',
    'ram',
    'prefix'
];

const SCRIPT_HOST = {
    share: {
        entrypoint: '/bin/shared.js',
        scripts: [
            '/bin/shared.js',
            '/bin/_share.js',
            '/lib/store.js',
            '/lib/models.js'
        ]
    }
};


async function _noop(flags) {}
async function _log(fn, msg) { await ns.tprint(`[ec:${fn}] => ${msg}`); }
function _nowString() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}-${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`;
}
function _defaultConfig() {
    store.setItem('ec:hosts', 4);
    store.setItem('ec:ram', 256);
    store.setItem('ec:prefix', 'anna');
    store.setItem('ec:pkg', 'share');
    store.setItem('ec:configured', true);
}
async function _verifyOneTimeConfig() {
    if (!store.getItem('ec:configured')) { _defaultConfig(); }
}

async function _refresh(flags) {
    const targets = ns.getPurchasedServers().filter(x => x.indexOf(store.getItem('ec:prefix')) == 0);
    for (const target of targets) {
        store.setItem(`${target}:ram`, store.getItem('ec:ram'));
        store.setItem(`${target}:share`, 0.75);
    }
}

async function _config(flags) {
    if (flags.l || flags.list) {
        for (const item of ALLOWED_CONFIG_ITEMS) {
            await _log('config-list', `${item} = ${store.getItem('ec:'+item)}`);
        }
        return;
    }

    for (const configItem of flags.items) {
        const [k,v] = configItem.split(/\=(.*)/s,2).filter(x => x);
        if (ALLOWED_CONFIG_ITEMS.includes(k)) {
            store.setItem('ec:' + k, v);
        }
    }
}

async function _deployServers() {
    await _log('deploy-servers', 'deploying servers');
    const hosts = ns.getPurchasedServers() || 0,
          count = store.getItem('ec:hosts'),
          shouldDeploy = hosts < count;

    await _log('deploy-servers', 'hosts = ' + hosts);
    await _log('deploy-servers', 'count = ' + count);
    await _log('deploy-servers', 'shouldDeploy = ' + shouldDeploy);

    if (!shouldDeploy) {
        await _log('deploy-servers', 'hosts already at maximum host count');
        return;
    }

    const ram = parseInt(store.getItem('ec:ram')),
          cost = ns.getPurchasedServerCost(ram),
          cash = ns.getServerMoneyAvailable('home'),
          canPurchaseServers = ((count - hosts) * cost) < cash;

    await _log('deploy-servers', 'ram = ' + ram);
    await _log('deploy-servers', 'cost = ' + cost);
    await _log('deploy-servers', 'canPurchaseServers = ' + canPurchaseServers);
    if (!canPurchaseServers) {
        await _log('deploy-servers', `insufficient funds to purchase servers, requires ${((count - hosts) * cost)}`);
        return;
    }

    for (let i = 0; i < (count - hosts); i++) {
        const hostname = store.getItem('ec:prefix') + '-' + _nowString();
        ns.purchaseServer(hostname, ram);
    }

    await _refresh(flags);
}
async function _destroyServers() {
    await _log('destroy-servers', 'destroying servers');

    const hosts = ns.getPurchasedServers();

    for (const host of hosts) {
        await _log('destroy-servers', `deleting ${host}`);
        ns.killall(host);
        ns.deleteServer(host);
    }
}

async function _deployScriptsToServers() {
    await _log('deploy-scripts', 'deploying scripts to servers');

    const hosts = ns.getPurchasedServers(),
          pkg = store.getItem('ec:pkg');

    for (const host of hosts) {
        await _log('deploy-scripts', `killing all scripts on ${host}`);
        ns.killall(host)

        await _log('deploy-scripts', `secure copying files to ${host} for pkg ${pkg}`);
        ns.scp(SCRIPT_HOST[pkg].scripts, host, 'home');

        await _log('deploy-scripts', `executing primary entrypoint on ${host}`);
        ns.exec(SCRIPT_HOST[pkg].entrypoint, host, 1);
    }
}

async function _cluster(flags) {
    if (flags.up && flags.down) {
        await _log('cluster', 'ERROR: Cannot pass both --up and --down to the cluster command');
        return;
    }

    if (flags.up) {
        await _deployServers();
    }

    if (flags.down) {
        await _destroyServers();
    }

    if (!flags.down && flags.deploy) {
        await _deployScriptsToServers();
    }
}

async function _help() {
    await _log('help', 'This is the help text');
}

export async function main(_ns) {
    ns = _ns;

    _verifyOneTimeConfig();

    if (ns.args.length == 0) {
        await _help();
        ns.exit();
    }

    ns.tail();

    const command = ns.args.shift(),
          fn = FN_MAP[command] || _noop,
          flags = ns.flags(FLAGS);

    await fn(flags);
    await ns.asleep(1);
}
