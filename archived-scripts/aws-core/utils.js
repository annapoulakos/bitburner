import * as ccSettings from "/aws-core/cc/settings.js";
import * as hnSettings from "/aws-core/hn/settings.js";

/**
 * @param {Array} defaultFlags flags to use as a base
 */
export function getAllFlags(ns, defaultFlags) {
    const settings = [defaultFlags, ccSettings.FLAGS, hnSettings.FLAGS];
    ns.tprint(`[default] => ${defaultFlags}`);
    ns.tprint(`[ccSettings] => ${ccSettings.FLAGS}`);
    ns.tprint(`[hnSettings] => ${hnSettings.FLAGS}`);
    let flags = [];

    settings.forEach(setting => flags.concat(setting));
    return flags;
}
