export function autocomplete(data, args) {
    return ['share'];
}

/** @param {NS} ns **/
export async function main(ns) {
	const command = ns.args[0];

	if (command == "share") {
		const servers = ns.getPurchasedServers();
		ns.tprint(`[deploy:share] => deploying /scripts/bin/share.js to [ ${servers.join(',')} ]`);
		for (const server of servers) {
			await ns.scp("/scripts/bin/share.js", server);
		}
	}
}
