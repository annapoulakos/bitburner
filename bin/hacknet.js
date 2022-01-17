/** @param {NS} ns **/
export async function main(ns) {
	ns.print('*** HACKNET AUTO_BUYER ***');

	while (true) {
		let cash = ns.getServerMoneyAvailable("home");

		if (cash >= ns.hacknet.getPurchaseNodeCost()) {
			ns.print(`-> purchasing node`);
			ns.hacknet.purchaseNode();
		} else {
			for (let i=0; i < ns.hacknet.numNodes(); i++) {
				if (cash > ns.hacknet.getLevelUpgradeCost(i, 1)) {
					ns.print(`-> upgrading level on ${i}`);
					ns.hacknet.upgradeLevel(i, 1);
				} else if (cash > ns.hacknet.getRamUpgradeCost(i, 1)) {
					ns.print(`-> upgrading RAM on ${i}`);
					ns.hacknet.upgradeRam(i, 1);
				} else if (cash > ns.hacknet.getCoreUpgradeCost(i, 1)) {
					ns.print(`-> upgrading cores on ${i}`);
					ns.hacknet.upgradeCore(i, 1);
				}
			}
		}

		await ns.sleep(1000);
	}
}
