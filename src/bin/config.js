import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

let ns;

const FN_MAP = {
    set: _set,
    get: _get,
    init: _init,
    remove: _remove,
    delete: _removeAll
};

export function autocomplete(data, args) {
    return [
        ...(Object.keys(FN_MAP))
    ];
}

async function _log(fn, msg) {
    await ns.print(`[config:${fn}] => ${msg}`);
}

const CONFIGS = {
    mattd: {
        'hero-servers:max': 25,
        'hero-servers:ram': 4096,
        'hero-targets:max': 10,
        'hero-targets:max-ram': 0.65,
        'matt.d:sleep': 20000
    }
};

async function _init(svc, ...args) {
    await _log('init', `initializing configuration for ${svc}`);
    for (const arg of args) {
        const [key,value] = arg.split(/\=(.*)/s).filter(x => x);
        await _log('init', `argument (${arg}) split into key (${key}) = value (${value})`);
        store.setItem(`${svc}:${key}`, value);
    }
}


async function _set(key, value) {
    store.setItem(key, value);
}

async function _get(key) {
    await ns.tprint(store.getItem(key));
}

async function _remove(key) {
    store.removeItem(key);
}

async function _removeAll(key) {
    const keys = store.keys();
    for (const k of keys) {
        if (k.indexOf(key) == 0) _remove(k);
    }
}

async function _noop(...args) {}

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    const command = ns.args.shift(),
          fn = FN_MAP[command] || _noop;

    await fn(...ns.args)
}
