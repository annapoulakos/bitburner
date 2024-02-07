import * as store from '/lib/store.js';

let ns, scriptName, scriptRunning, host;

const DAEMON_MAP = {
	statmon: '/bin/statmon.js',
	rooterd: '/bin/rooterd.js',
	batchd: '/bin/batchd.js',
	nethackd: '/bin/nethackd.js',
	shared: '/bin/shared.js'
};

const FN_MAP = {
	init: _init,
	start: _start,
	stop: _stop,
	restart: _restart,
	list: _list,
	add: _add,
	remove: _remove
};

export function autocomplete(data, args) {
	return [
		...Object.keys(FN_MAP),
		...Object.keys(DAEMON_MAP)
	];
}

/** Utility Functions */
function _warn(msg) { ns.toast(msg, 'warning', 3000); }
function _success(msg) { ns.toast(msg, 'success', 3000); }
function _info(msg) { ns.toast(msg, 'info', 3000); }

function _getRunning () {
	return store.getItem('service:running') || [];
}
function _setRunning(running) {
	store.setItem('service:running', running);
}
function _addRunning (service) {
	let r = _getRunning();
	r.push(service);
	_setRunning(r);
}
function _removeRunning(service) {
	let r = _getRunning();
	r = r.filter(x => x != service);
	_setRunning(r);
}


/**
 * Initialization function for services to run on reset
 *
 * Service startup list is stored in store(service:init) as a List<string>,
 * defaults to an empty list
 */
async function _init() {
	ns.tail();
	await ns.print('[service:init] => clearing running list');
	store.setItem('service:running', []);

	await ns.print('[service:init] => retrieving service initialization list; default []')
	store.setItem('service:init', store.getItem('service:init') || []);

	const service_list = store.getItem('service:init') || [];
	for (const service of service_list) {
		await ns.print(`[service:init] => starting service: ${service}`);
		scriptName = DAEMON_MAP[service];
		scriptRunning = ns.scriptRunning(scriptName, host)
		await _start(service);
	}
}

/**
 * Starts a service if it isn't already started.
 *
 * @param {string} service
 */
async function _start(service) {
	if (scriptRunning) {
		await ns.print(`service:start] => ${service} is already running`);
		_warn(`[service:start] => ${service} is already running`);
	} else {
		ns.run(scriptName, 1);
		_addRunning(service)
		_success(`[service:start] => started ${service}`);
	}
	await ns.asleep(1);
}

/**
 * Stops a service if it is currently running.
 *
 * @param {string} service
 */
async function _stop(service) {
	if (scriptRunning) {
		ns.kill(scriptName, host);
		_removeRunning(service);
		_success(`[service:stop] => stopped ${service}`);
	} else {
		_warn(`[service:stop] => ${service} is not running`);
	}
}

/**
 * Stops and restarts a service
 *
 * @param {string} service
 */
async function _restart(service) {
	if (scriptRunning) {
		ns.kill(scriptName, host);
		_removeRunning(service);

		_info(`[service:restart] => stopped ${service}`);
	}

	ns.run(scriptName, 1);
	_addRunning(service);
	_success(`[service:restart] => ${service} started`);
}

/**
 * Prints a list of running services; prints a list of startup services
 */
async function _list() {
	let services = store.getItem('service:running') || [];
	for (const service of services) {
		await ns.tprint(`[service:list] => running: ${service}`);
	}
	services = store.getItem('service:init') || [];
	for (const service of services) {
		await ns.tprint(`[service:list] => init: ${service}`);
	}
}

/**
 * Adds a service to the startup list
 *
 * @param {string} service
 */
async function _add(service) {
	let services = store.getItem('service:init') || [];

	if (!services.includes(service)) {
		services.push(service);
		_success(`[services:add] => added ${service} to init; ${services.length} services`);
	}
	store.setItem('service:init', services);
}

/**
 * Removes a service from the list of startup services
 *
 * @param {string} service
 */
async function _remove(service) {
	let services = store.getItem('service:init');

	if (services.includes(service)) {
		const index = services.indexOf(service);
		services.splice(index, 1);
		store.setItem('service:init', services);
		_success(`[service:remove] => removed ${service}; ${services.length} remaining`);
	}
}

/**
 * Main routine.
 *
 * Executed from CLI with this command:
 *
 * ./bin/service.js COMMAND [SERVICE_NAME]
 *
 *      COMMAND = one of init, start, stop, restart, list, add, remove
 *      SERVICE_NAME = the name of the service to modify (init and list do not require this line item)
 *
 * @param {NS} ns **/
export async function main(_ns) {
	ns = _ns;
	const command = ns.args[0],
		  service = ns.args[1],
		  fn = FN_MAP[command];

	host = ns.getHostname()
	scriptName = DAEMON_MAP[service];
	try {
        scriptRunning = ns.scriptRunning(scriptName, host);
    } catch {}

	await fn(service);
}
