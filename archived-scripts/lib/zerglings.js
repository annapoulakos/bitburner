/**
 * @param {NS} ns
 * @param {string} server
**/

export async function rush(ns, server) {
	let root = ns.hasRootAccess(server);

	if (!root) {
		let canRoot = ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(server);

		if (canRoot) {
			const fn_list = [ns.brutessh, ns.ftpcrack, ns.httpworm, ns.relaysmtp, ns.sqlinject];

			for (const fn of fn_list) {
				try { fn(server); } catch {}
			}
		}

		try {
			ns.nuke(server);
		} catch {}
		root = ns.hasRootAccess(server);
	}

	return root;
}
