import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

let ns, scriptName, scriptRunning, host;

const DAEMON_MAP = {
	nethackd: '/bin/nethackd.js',
	statmon: '/bin/statmon.js',
	rooterd: '/bin/rooterd.js',
	mattd: '/bin/mattd.js',
	herod: '/bin/herod.js',
	batchd: '/bin/batchd.js',
	shared: '/bin/shared.js',
	trashmon: '/bin/trashmon.js'
};

const FN_MAP = {
	start: _start,
	stop: _stop,
	restart: _restart,
	add: _add,
	list: _list,
	remove: _remove
};

export function autocomplete(data, args) {
	return [
		...Object.keys(FN_MAP),
		...Object.keys(DAEMON_MAP)
	];
}

function _start(service) {
	if (scriptRunning) {
		utils.warn(`[service:start] => ${service} is already running`);
	} else {
		ns.run(scriptName, 1);
		utils.success(`[service:start] => started ${service}`);
	}
}

function _stop(service) {
	if (scriptRunning) {
		ns.kill(scriptName, host);
		utils.success(`[service:stop] => stopped ${service}`);
	} else {
		utils.warn(`[service:stop] => ${service} is not running`);
	}
}

function _restart(service) {
	if (scriptRunning) {
		ns.kill(scriptName, host);
		utils.info(`[service:restart] => stopped ${service}`);
	}

	ns.run(scriptName, 1);
	utils.success(`[service:restart] => ${service} started`);
}

function _add(service) {
	let services = store.getItem('services:init') || [];

	if (!services.includes(service)) {
		services.push(service);
		utils.success(`[services:add] => added ${service} to init; ${services.length} services`);
	}
	store.setItem('services:init', services);
}

function _list(service) {
	let services = store.getItem('services:init') || [];
	services.forEach(service => utils.log(`[service:list] => ${service}`));
}

function _remove(service) {
	let services = store.getItem('services:init');

	if (services.includes(service)) {
		const index = services.indexOf(service);
		services.splice(index, 1);
		store.setItem('services:init', services);
		utils.success(`[service:remove] => removed ${service}; ${services.length} remaining`);
	}
}

/** @param {NS} ns **/
export async function main(_ns) {
	ns = _ns;
	utils.configure(_ns);

	const command = ns.args[0],
		  service = ns.args[1],
		  fn = FN_MAP[command];

	host = ns.getHostname()
	scriptName = DAEMON_MAP[service];
	scriptRunning = ns.scriptRunning(scriptName, host);

	fn(service);
}
