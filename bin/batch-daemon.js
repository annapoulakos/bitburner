import * as utils from '/scripts/lib/utilities.js';

let ns, hostMem;




/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    utils.log('[batch-daemon:main] => starting batch daemon...');
}
