import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

const PREFIX = 'hero',
      MAX_HERO_SERVERS = 20,
      SERVER_RAM = 4096,
      FILES = [
          '/bin/_grow.js',
          '/bin/_hack.js',
          '/bin/_weaken.js',
          '/bin/_share.js',
          '/lib/store.js',
          '/lib/utilities.js',
          '/bin/sigterm.js',
          '/bin/batching.js',
          '/bin/batchLocal.js',
          '/bin/shared.js',
          '/bin/herod.js'
      ];

let ns;



/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    while (true) {
        const cash = ns.getServerMoneyAvailable('home'),
              cost = ns.getPurchasedServerCost(SERVER_RAM),
              hosts = ns.getPurchasedServers().filter(host => host.startsWith(PREFIX));

        // Exit if more than MAX_HERO_SERVERS
        if (hosts.length >= MAX_HERO_SERVERS) { ns.exit(); }

        if (cost < cash) {
            const hostname = `${PREFIX}-${utils.nowString()}`;
            ns.purchaseServer(hostname, SERVER_RAM);
            store.setItem(`${hostname}:ram`, 8192);
            store.setItem(`${hostname}:money`, 0);
            utils.success(`[mattd] => ${hostname} purchased (8192 Gb RAM)`);

            await ns.scp(FILES, 'home', hostname);
            ns.exec('/bin/shared.js', hostname, 1);
            ns.exec('/bin/herod.js', hostname, 1);
        }

        await ns.sleep(60000);
    }

}
