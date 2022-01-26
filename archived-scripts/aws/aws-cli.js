import * as utils from "aws/aws-utils.js";

const FLAGS = [["size", 32]]; // TODO: fix this so i don't have to grab a bajillion different flags. Maybe do it after i grab the command name so i can grab the flags from the various packages.

/**
 * AWS-CLI (Anna Web Services - Command Line Interface)
 *      creates a new server provided the RAM for the server
 *
 * FLAGS:
 *  --verbose { true; false } => enables verbose console logging
 *  --size { 32 } => determines the size of the server to build, default: 32Gb RAM
 *
 * @param {NS} ns
 **/
export async function main(ns) {
    utils.configure(ns, FLAGS);

    const commandBase = ns.args[0],
          nsArgs = ns.args.map(x=>x);

    nsArgs.shift();

    if (ns.fileExists(`/aws/${commandBase}.js`)) {
        ns.run(`/aws/${commandBase}.js`, 1, ...nsArgs);
    } else {
        throw 'command not found; run aws help for more information';
    }
}
