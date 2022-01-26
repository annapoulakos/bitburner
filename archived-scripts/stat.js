/** @param {NS} ns **/
export async function main(ns) {
    const server = ns.getServer(ns.args[0]);

    const ports = [
        (s => s.sshPortOpen?'ssh':'')(server),
        (s => s.ftpPortOpen?'ftp':'')(server),
        (s => s.smtpPortOpen?'smtp':'')(server),
        (s => s.httpPortOpen?'http':'')(server),
        (s => s.sqlPortOpen?'sql':'')(server),
    ].filter(String);

    const messages = [
        `Root? ${server.hasAdminRights}`,
        `Backdoor? ${server.backdoorInstalled}`,
        `Hostname: ${server.hostname} -- IP: ${server.ip}`,
        `CPU: ${server.cpuCores} -- Mem: ${server.ramUsed} / ${server.maxRam}`,
        `Money: ${server.moneyAvailable} / ${server.moneyMax}`,
        `Security: ${server.hackDifficulty} / ${server.minDifficulty} (${server.baseDifficulty})`,
        `Ports: ${ports.join(' | ')}`
    ];

    for (const msg of messages) { ns.tprint(msg); }
}
