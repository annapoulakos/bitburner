import * as utils from "/scripts/lib/utilities.js";

export class KubeConfig {
    constructor (servers, ram, prefix, scripts, run) {
        this.servers = servers;
        this.ram = ram;
        this.prefix = prefix;
        this.scripts = scripts;
        this.run = run;
    }

    static Factory(ns, filename) {
        utils.configure(ns);
        utils.log(`[KubeConfig:Factory] => loading configuration file`);
        const lines = utils.read(filename).split('\n').map(x => x);

        utils.log(`[KubeConfig:Factory] => found configuration with ${lines.length} lines`);

        let servers = 0,
            ram = 0,
            prefix = 'anna',
            scripts = [],
            run = '/scripts/bin/entrypoint.js';

        for (const line of lines) {
            const [c, x] = line.split(':');
            if (c == "servers") servers = parseInt(x);
            if (c == "ram") ram = parseInt(x);
            if (c == "prefix") prefix = x.replace(/[\n\r\t\s]+/gm, '');
            if (c == "scripts") scripts.push(x.replace(/[\n\r\t\s]+/gm, ''));
            if (c == "run") run = x.replace(/[\n\r\t\s]+/gm, '');
        }

        return new KubeConfig(servers, ram, prefix, scripts, run);
    }
}
