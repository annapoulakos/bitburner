/** @param {NS} ns **/
export async function main(ns) {
    while (true) {
        if (!ns.isBusy()) {
            ns.commitCrime('rob store');
        }
    }
}
