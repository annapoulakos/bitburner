import * as utils from "/scripts/lib/utilities.js";

export class Security {
    /**
     * @param {NS} _ns
     */
    constructor(_ns) {
        this.ns = _ns;
        utils.configure(_ns);

        this.pl = {
            ssh:_ns.brutessh,
            ftp:_ns.ftpcrack,
            smtp:_ns.relaysmtp,
            http:_ns.httpworm,
            sql:_ns.sqlinject
        };
    }

    /**
     * @param {string} server hostname
     */
    crack (server) {
        utils.log(`[Security::crack] => cracking ${server}...`);
        this.__force(server);

        utils.log(`[Security::crack] => nuking server...`);
        try {
            this.ns.nuke(server);
        } catch {
            utils.log(`[Security::crack] => unable to nuke server...`);
            return false;
        }

        return true;
    }

    /**
     * @param {string} server hostname
     */
    __force (server) {
        utils.log(`[Security::__force] => forcibly opening ports...`);
        let opened = [];
        for (const [port, fn] of Object.entries(this.pl)) {
            try {
                fn(server);
                opened.push(port);
            } catch {}
        }

        utils.log(`[Security::__force] => opened: [ ${opened.join(',')} ]`);
    }
}
