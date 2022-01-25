import * as utils from "/scripts/lib/utilities.js";

let ns;

export function autocomplete(data, args) {
    return ['kill', 'buy'];
}

/** @param {NS} ns **/
export async function main(_ns) {
	ns = _ns;
	utils.configure(ns);

	const command = ns.args[0];

	if (command == "kill") {
		const prefix = ns.args[1],
			  servers = ns.getPurchasedServers();
		utils.log(`[cc:kill] => killing ${servers}`);
		servers.forEach(server => {
			if (prefix) {
				if (!server.startsWith(prefix)) {
					return;
				}
			}
			utils.log(`[cc:kill] => killing ${server}`);
			ns.killall(server);
			ns.deleteServer(server);
		});
	} else if (command == "buy") {
		const qty = ns.args[1],
		      size = ns.args[2],
			  servers = Array(qty).fill(0);

		ns.tprint(`[cc:buy] => buying ${qty} servers with ${size} ram`);

		servers.forEach(s => ns.purchaseServer("anna", size));
	}
}
