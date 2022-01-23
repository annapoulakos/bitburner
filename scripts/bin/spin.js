export function autocomplete(data, args) {
    return ['start-share', 'kill-scripts', 'share-power'];
}

/** @param {NS} ns **/
export async function main(ns) {
	const command = ns.args[0],
		  servers = ns.getPurchasedServers();

	if (command == "start-share") {
		const threads = ((512/5)|0) + 1;

		for (const server of servers) {
			ns.exec("/scripts/bin/share.js", server, threads);
		}
	} else if (command == "kill-scripts") {
		servers.forEach(server => ns.killall(server));
	} else if (command == "share-power") {
		ns.tprint(`[spin:share-power] => ${ns.getSharePower()}`);
	}
}
