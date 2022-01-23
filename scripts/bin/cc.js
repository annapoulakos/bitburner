export function autocomplete(data, args) {
    return ['kill', 'buy'];
}

/** @param {NS} ns **/
export async function main(ns) {
	const command = ns.args[0];

	if (command == "kill") {
		const servers = ns.getPurchasedServers();
		ns.tprint(`[cc:kill] => killing ${servers}`);
		servers.forEach(server => ns.deleteServer(server));
	} else if (command == "buy") {
		const qty = ns.args[1],
		      size = ns.args[2],
			  servers = Array(qty).fill(0);

		ns.tprint(`[cc:buy] => buying ${qty} servers with ${size} ram`);

		servers.forEach(s => ns.purchaseServer("anna", size));
	}
}
