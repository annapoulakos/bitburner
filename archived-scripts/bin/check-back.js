
/**
 * @param {NS} ns
 */
export async function main(ns) {
    let visited = [], targets = ['home'];

    while (targets && targets.length) {
        const target = targets.shift(),
              new_targets = ns.scan(target);

        visited.push(target);

        new_targets.forEach(new_target => {
            if (!visited.includes(new_target) && !targets.includes(new_target)) {
                targets.push(new_target);
            }
        });
    }

    ns.tprint(visited);
}
