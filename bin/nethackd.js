import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

const SLEEP_DELAY_MS = 10000;
let ns, hacknet;

function _numNodes() {
	return hacknet.numNodes();
}

function _maxNodes() {
	return hacknet.maxNumNodes();
}

async function _purchaseNodes() {
	const curr = _numNodes(),
		  maxn = _maxNodes();

	if (curr < maxn) {
		let nodesPurchased = 0,
			cashOnHand = store.getItem('home:money');

		while (cashOnHand > hacknet.getPurchaseNodeCost()) {
			try {
				hacknet.purchaseNode();
				nodesPurchased += 1;
			} catch {}

			await ns.sleep(1000);
			cashOnHand = store.getItem('home:money');
		}

		utils.info(`[nethackd] => purchased ${nodesPurchased} nodes`);
	}
}

async function _applyUpgrade(index, costFn, upgradeFn, name) {
	let count = 0,
		cashOnHand = store.getItem('home:money');

	while (cashOnHand > costFn(index, 1)) {
		try {
			upgradeFn(index);
			count += 1;
		} catch {}

		await ns.sleep(1000);
		cashOnHand = store.getItem('home:money');
	}

	utils.info(`[nethackd:${index}] => added ${count} ${name} upgrades`);
}

async function _levelNode(index) {
	await _applyUpgrade(index, hacknet.getLevelUpgradeCost, hacknet.upgradeLevel, 'level');
}

async function _upgradeRam(index) {
	await _applyUpgrade(index, hacknet.getRamUpgradeCost, hacknet.upgradeRam, 'ram');
}

async function _upgradeCore(index) {
	await _applyUpgrade(index, hacknet.getCoreUpgradeCost, hacknet.upgradeCore, 'core');
}

async function _getProduction() {
	const nodes = _numNodes();
	let production = 0;

	for (let i=0; i<nodes; i++) {
		production += hacknet.getNodeStats(i).production;
	}

	store.setItem('hacknet:production', production);
	await ns.sleep(0);

	return production;
}


/** @param {NS} _ns **/
export async function main(_ns) {
	ns = _ns
	hacknet = ns.hacknet;
	utils.configure(ns);

	if (Number.isInteger(ns.args[0])) {
		store.setItem('hacknet:maxprod', ns.args[0]);
	}

	let running = true,
		maxprod = store.getItem('hacknet:maxprod'),
		production = _getProduction();

	if (maxprod == null) {
		store.setItem('hacknet:maxprod', 10000);
		maxprod = store.getItem('hacknet:maxprod');
	}

	while (running) {
		utils.log('[nethackd] => purchase nodes');
		await _purchaseNodes();

		const nodes = hacknet.numNodes();
		for (let i=0; i<nodes; i++) {
			utils.log(`[nethackd] => purchase levels for ${i}`);
			await _levelNode(i);

			utils.log(`[nethackd] => purchase ram for ${i}`);
			await _upgradeRam(i);

			utils.log(`[nethackd] => purchase cores for ${i}`);
			await _upgradeCore(i);
		}

		utils.log('[nethackd] => get current production');
		production = await _getProduction();

		running = production < maxprod;
		utils.info(`[nethackd] => production: ${production.toFixed(2)}`);
		await ns.sleep(SLEEP_DELAY_MS);
	}

	utils.success(`[nethackd] => production goal reached (${store.GetItem("hacknet:production").toFixed(2)})`);
}
