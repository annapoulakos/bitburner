import * as utils from '/scripts/lib/utilities.js';
const localStorage = globalThis['window'].localStorage;
let ns;

export function autocomplete(data, args) {
    return [

    ];
}

function _list(key) {
    const hosts = JSON.parse(localStorage.getItem(key));
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
