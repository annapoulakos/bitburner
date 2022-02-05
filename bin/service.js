import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

let ns;

const DAEMON_MAP = {
	nethackd: '/bin/nethackd.js',
	statmon: '/bin/statmon.js',
	rooterd: '/bin/rooterd.js',
	mattd: '/bin/mattd.js',
	herod: '/bin/herod.js',
	batchd: '/bin/batchd.js',
	shared: '/bin/shared.js'
};

export function autocomplete(data, args) {
	return [
		...['start', 'stop', 'restart'],
		...Object.keys(DAEMON_MAP)
	];
}


/** @param {NS} ns **/
export async function main(_ns) {
	ns = _ns;
	utils.configure(_ns);

	const host = ns.getHostname(),
		  command = ns.args[0],
		  args = ns.args.slice(1),
		  scriptName = DAEMON_MAP[args[0]],
		  scriptRunning = ns.scriptRunning(scriptName, host);

	if (command == 'start') {
		if (!scriptRunning) {
			utils.log(`[service:start] => starting ${args[0]}`);
			ns.run(scriptName, 1);
            utils.success(`[service:start] => started ${args[0]}`);
		} else {
			utils.log(`[service:start] => ${args[0]} is already running`);
            utils.warn(`[service:start] => ${args[0]} is already running`);
		}
	}
	else if (command == 'stop') {
		if (scriptRunning) {
			utils.log(`[service:stop] => stopping ${args[0]}`);
			ns.kill(scriptName, host);
            utils.success(`[service:stop] => stopped ${args[0]}`);
		} else {
			utils.log(`[service:stop] => ${args[0]} is not running`);
            utils.warn(`[service:stop] => ${args[0]} is not running`);
		}
	} else if (command == 'restart') {
        if (scriptRunning) {
            utils.log(`[service:restart] => stopping ${args[0]}`);
            ns.kill(scriptName, host)
            utils.success(`[service:restart] => stopped ${args[0]}`);
        }

        utils.log(`[service:restart] => starting ${args[0]}`);
        ns.run(scriptName, 1);
        utils.success(`[service:restart] => started ${args[0]}`);
    }
}
