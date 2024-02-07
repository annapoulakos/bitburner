import * as store from '/lib/store.js';

let ns;

const FN_MAP = {
    hosts: _hosts,
    rooted: _rooted,
    backdoors: _backdoors,
    ram: _ram,
    money: _money
};

export function autocomplete(data, args) {
    return [
        ...Object.keys(FN_MAP)
    ];
}

async function _noop() {}
async function _display(items) {
    for (const item of items) {
        await ns.tprint(item);
    }
}

async function _hosts() {
    const hosts = store.getItem('hosts');
    await _display(hosts);
}

async function _rooted() {
    const rooted = store.getItem('rooted');
    await _display(rooted);
}

async function _backdoors() {
    const backdoors = store.getItem('backdoors');
    await _display(backdoors);
}

async function _ram() {
    const hosts = store.getItem('hosts'),
          ram = hosts.map( host => host + ' => ' + store.getItem(`${host}:ram`));
    await _display(ram);
}

async function _money() {
    const hosts = store.getItem('hosts'),
          money = hosts.map( host => host + ' => ' + store.getItem(`${host}:money`));
    await _display(money);
}

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;

    const command = ns.args[0],
          fn = FN_MAP[command] || _noop;

    await fn();
}
