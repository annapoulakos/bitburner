import * as utils from '/scripts/lib/utilities.js';

let ns;

async function _portHandler(message) {
    utils.log(`[kube-daemon] => ACK ${message}`);
}


/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    utils.log(`[kube-daemon:main] => kube daemon starting up...`);
    let pods = {};


    utils.log('[kube-daemon:main] => kube daemon startup completed');
    while (true) {
        const portPeek = ns.peek(utils.PORTS.k8s);

        if (portPeek != "NULL PORT DATA") {
            let success = _portHandler(portPeek);

            if (success) {
                ns.read(utils.PORTS.k8s);
            }
        }

        await ns.sleep(10000);
    }
}
