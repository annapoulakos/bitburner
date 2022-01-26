import * as utils from "/aws-core/utils.js";
import * as settings from "/aws-core/settings.js";

/**
 * AWS-CLI
 * Anna Web Services - Command Line Toolkit
 *
 * Requires:
 *    alias aws="run /aws-core/main.js "
 */

/**
 * Primary entrypoint into application stack
 * @param {NS} ns
 */
export async function main(ns) {
    // TODO: Load flags
    // maybe preload help docs?
    // TODO: Load command list?
    // TODO: Load utilities

    const flags = ns.flags(utils.getAllFlags(ns, settings.FLAGS));
    ns.tprint(`[settings] => ${settings.FLAGS}`);
    ns.tprint(flags);
}

/**
 * TODO:
 *
 * Commands
 *   cc => Cloud Compute utilities
 *   hn => Hacknet utilities
 *
 * Examples
 *   aws help => returns help documentation for the main aws command
 *   aws version => returns version information
 *
 *   aws cc help => returns help documentation for the aws cc command
 *   aws cc create => creates a new instance and auto assigns a name at the default size
 *   aws cc create --size 512 => creates a new instance, auto assigns a name at 512Gb of RAM
 *   aws cc create --size 512 --region anna-east-1 => creates a new instance, assigns "anna-east-1" as the name, at 512Gb RAM
 *
 *   aws cc get --region anna-east-1 => returns information about the specified instance
 *   aws cc get-all => returns information about all of the available instances
 *
 *   aws cc update --region anna-east-1 --size 512 => updates the provided server to the new size
 *   aws cc update-all --size 512 => updates all available servers to the new size
 */
