const FLAGS = [
	['verbose', false],
	['maxprod', 500000]
];

var _ns = null;
var _flags = {};

function _disable() {
	const logs = [
		'disableLog',
		'getServerMoneyAvailable',
		'hacknet.getPurchaseNodeCost',
		'hacknet.purchaseNode',
		'hacknet.numNodes',
		'hacknet.getLevelUpgradeCost',
		'hacknet.upgradeLevel',
		'hacknet.getRamUpgradeCost',
		'hacknet.upgradeRam',
		'hacknet.getCoreUpgradeCost',
		'hacknet.upgradeCore',
		'hacknet.getNodeStats',
		'sleep'
	];
	logs.forEach(l => _ns.disableLog(l));
}

function log(message) {
	if (_flags['verbose']) { _ns.tprint(message); }
	_ns.print(message)
}

/** @param {NS} ns **/
export async function main(ns) {
	_ns = ns
	_disable();
	_flags = ns.flags(FLAGS);

	log('*** HACKNET AUTO_BUYER ***');

	let running = true;

	const money = ns.getServerMoneyAvailable,
		  buy = ns.hacknet.purchaseNode,
		  levelCost = ns.hacknet.getLevelUpgradeCost,
		  upLevel = ns.hacknet.upgradeLevel,
		  nodes = ns.hacknet.numNodes,
		  ramCost = ns.hacknet.getRamUpgradeCost,
		  upRam = ns.hacknet.upgradeRam,
		  coreCost = ns.hacknet.getCoreUpgradeCost,
		  upCore = ns.hacknet.upgradeCore;


	while (running) {
		if (money("home") > ns.hacknet.getPurchaseNodeCost()) {
			log(`[hacknet] => purchasing node`);
			buy();
		}

		let production = 0;

		for (let i=0; i < nodes(); i++) {
			if (money("home") > levelCost(i, 1)) {
				log(`[hacknet:${i}] => upgrade level`);
				upLevel(i, 1);
			}

			if (money("home") > ramCost(i, 1)) {
				log(`[hacknet:${i}] => upgrade ram`);
				upRam(i, 1);
			}

			if (money("home") > coreCost(i, 1)) {
				log(`[hacknet:${i}] => upgrade level`);
				upCore(i, 1);
			}

			const node = ns.hacknet.getNodeStats(i);
			production += node.production;
		}

		log(`[hacknet] => ${production.toFixed(2)} / second`);
		if (production > _flags['maxprod']) {
			log(`[hacknet] => production goal reached; exiting`);
			running = false;
		}

		log('[hacknet] => sleeping for 5 seconds');
		await ns.sleep(5000);
	}
}
