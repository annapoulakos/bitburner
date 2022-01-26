import * as utils from "aws/aws-utils.js";
import * as ec2 from "aws/ec2.js";

const FLAGS = [];

/**
 * @param {NS} ns
 **/
 export async function main(ns) {
    utils.configure(ns, FLAGS);

    const commands = {
        ec2: ec2.HELP,
    };

    for (const command in commands) {
        ns.tprint(`[${command}] => ${commands[command]}`);
    }
}
