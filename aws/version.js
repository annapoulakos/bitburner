import * as utils from "aws/aws-utils.js";
import * as ec2 from "aws/ec2.js";

const FLAGS = [];
const VERSION = [
    'Anna Web Services CLI (AWS-CLI)',
    'v1.0.0'
];
/**
 * @param {NS} ns
 **/
 export async function main(ns) {
    utils.configure(ns, FLAGS);

    for (const line of VERSION) { ns.tprint(line); }
}
