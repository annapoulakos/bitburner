import * as utils from '/scripts/lib/utilities.js';
import * as store from '/scripts/lib/store.js';

let ns;

function _listRam() {
    const hosts = store.getItem('hosts'),
          memory = hosts.map(host => store.getItem(`${host}:ram`));

    for (const i in hosts) {
        ns.tprint(`${hosts[i]} => ${memory[i]}`);
    }
}

function _listMoney() {
    const hosts = store.getItem('hosts'),
          memory = hosts.map(host => store.getItem(`${host}:money`));

    for (const i in hosts) {
        ns.tprint(`${hosts[i]} => ${money[i]}`);
    }
}


function _list(key) {
    if (key == 'ram') {
        _listRam();
        return;
    } else if (key == 'money') {
        _listMoney();
        return;
    }
    const hosts = store.getItem(key);
    hosts.forEach(host => ns.tprint(host));
}

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    const key = ns.args[0] || 'hosts';

    _list(key);
}

export function autocomplete(data, args) {
    return [
        'hosts', 'rooted', 'backdoors', 'ram', 'money'
    ];
}
