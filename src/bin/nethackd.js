//import * as utils from '/lib/utilities.js';
import * as store from '/lib/store.js';

const SLEEP_DELAY_MS = 10000;
let ns, hacknet;

async function _log(fn, msg) {
	await ns.print(`[nethackd:${fn}] => ${msg}`);
}

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
			cashOnHand = store.getItem('home:money'),
			purchasePrice = hacknet.getPurchaseNodeCost(),
			production = await _getProduction(),
			maxprod = store.getItem('hacknet:maxprod');

		while (production < maxprod && cashOnHand > purchasePrice) {
			try {
				hacknet.purchaseNode();
				nodesPurchased += 1;
			} catch {}

			await ns.asleep(500);
			cashOnHand = store.getItem('home:money');
			purchasePrice = hacknet.getPurchaseNodeCost();
			production = await _getProduction();
		}

		ns.toast(`[nethackd] => purchased ${nodesPurchased} nodes`, 'info', 3000);
	}
}

async function _applyUpgrade(index, costFn, upgradeFn, name) {
	let count = 0,
		cashOnHand = store.getItem('home:money'),
		production = await _getProduction(),
		maxprod = store.getItem('hacknet:maxprod');

	while (production < maxprod && cashOnHand > costFn(index, 1)) {
		try {
			upgradeFn(index);
			count += 1;
		} catch {}

		await ns.asleep(1000);
		cashOnHand = store.getItem('home:money');
		production = await _getProduction();
	}

	if (count > 0) {
		ns.toast(`[nethackd:${index}] => added ${count} ${name} upgrades`, 'info', 3000);
	}
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
		const node = hacknet.getNodeStats(i);
		production += node.production;
	}

	store.setItem('hacknet:production', production);
	await ns.asleep(0);

	return production;
}


/** @param {NS} _ns **/
export async function main(_ns) {
	ns = _ns
	hacknet = ns.hacknet;

	await _log('main', 'starting nethack daemon');

	if (Number.isInteger(ns.args[0])) {
		store.setItem('hacknet:maxprod', ns.args[0]);
	}

	let maxprod = store.getItem('hacknet:maxprod'),
		production = await _getProduction();

	if (maxprod == null) {
		store.setItem('hacknet:maxprod', 200000);
		maxprod = store.getItem('hacknet:maxprod');
	}

	while (production < maxprod) {
		await _log('main', '[nethackd] => purchase nodes');
		await _purchaseNodes();

		const nodes = hacknet.numNodes();
		for (let i=0; i<nodes; i++) {
			await _log('main', `[nethackd] => purchase ram for ${i}`);
			await _upgradeRam(i);

			await _log('main', `[nethackd] => purchase cores for ${i}`);
			await _upgradeCore(i);

			await _log('main', `[nethackd] => purchase levels for ${i}`);
			await _levelNode(i);
		}

		await _log('main', '[nethackd] => get current production');
		production = await _getProduction();

		ns.toast(`[nethackd] => production: ${production.toFixed(2)}`, 'info', 3000);
		await ns.asleep(SLEEP_DELAY_MS);
	}

	ns.toast(`[nethackd] => production goal reached (${store.getItem("hacknet:production").toFixed(2)})`, 'success', 3000);
}
