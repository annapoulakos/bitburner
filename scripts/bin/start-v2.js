import * as utils from '/scripts/lib/utilities.js';
import {stat} from "/scripts/bin/statistician.js";

let ns;

export function autocomplete(data, args) {
    return [

    ];
}

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);


}
