import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

let ns;


/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    store.setItem('prep.d:targets', ['fulcrumassets']);
    store.setItem('prep.d:done', []);

    while (true) {
        const finished = store.getItem('prep.d:done'),
              servers = store.getItem('rooted').filter(host => !finished.includes(host));

        servers.forEach(server => {

        })


        for (const server of servers) {
            const wt = ns.getWeakenTime(server);

            utils.log(`[prep.d] => weakening ${server} (${ns.getServerSecurityLevel(server)}) over ${(wt/1000).toFixed(2)} seconds`);
            ns.run('/bin/_weaken.js', 1000, server);
            await ns.sleep(wt);
        }

        await ns.sleep(60000);
    }
}
