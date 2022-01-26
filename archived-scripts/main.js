import * as food from "lib/food.js";

const SLEEP_DELAY_MS = 3000;

function getThreads(ns, server, size) {
	const [t,u] = ns.getServerRam(server);
	return ((t-u) / size)|0;
}

/** @param {NS} ns **/
export async function main(ns) {
	const server = ns.args[0];

	await food.prep(ns, server);

	const money = ns.getServerMaxMoney(server);
	const security = ns.getServerMinSecurityLevel(server);

	await ns.writePort(1, server);

	while (true) {
		if (ns.getServerSecurityLevel(server) > security) {
			const threads = getThreads(ns, server, 1.75);
			if (threads > 0) {
					ns.exec("lib/weaken.js", server, threads, server);
			}
		} else if (ns.getServerMoneyAvailable(server) < money) {
			const threads = getThreads(ns, server, 1.75);
			if (threads > 0) {
					ns.exec("lib/grow.js", server, threads, server);
			}
		} else {
			const threads = getThreads(ns, server, 1.70);
			if (threads > 0) {
					ns.exec("lib/hack.js", server, threads, server)
			}
		}

		await ns.sleep(SLEEP_DELAY_MS);
	}
}
