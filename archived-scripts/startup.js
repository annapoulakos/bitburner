import * as utils from '/scripts/lib/utilities.js';
const localStorage = globalThis['window'].localStorage;
let ns;

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    utils.log('[startup:main] => starting service mesh');
    //* InfoDaemon
    ns.exec('/bin/info-daemon.js', 'home', 1);
    //*/

    /* KubeDaemon
    ns.exec('/bin/kube-daemon.js', 'home', 1);
    localStorage.setItem('pid:kube-daemon', infoPid);
    //*/

    /* BatchDaemon
    ns.exec('/bin/batch-daemon.js', 'home', 1);
    localStorage.setItem('pid:batch-daemon', infoPid);
    //*/

    /* HacknetDaemon
    ns.exec('/bin/hacknet-daemon.js', 'home', 1);
    localStorage.setItem('pid:hacknet-daemon', infoPid);
    //*/
}
