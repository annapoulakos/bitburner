/** @param {NS} ns **/
export async function main(ns) {
    ns.tprint("*** Fuckin'... what the fuckin'... fuck... who the fuck fucked this fuckin' how did you two fuckin' fucks... FUCK!");
    var data = ns.readPort(1);

    while (data != "NULL PORT DATA") {
        ns.tprint(`-> killing ${data}`);
        ns.killall(data);
        data = ns.readPort(1);
    }
}
