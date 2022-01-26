import * as utils from "/scripts/lib/utilities.js";
let ns = null;

export function autocomplete(data, args) {
    return [
        ...data.servers
    ];
}

export async function main(_ns) {
    ns = _ns;
    utils.configure(_ns);

    const gPathList = (snl, st) => {
        let spl = snl.map(() => ""),
            v = [],
            q = [st];
        while(q.length>0) {
            let n=q.shift();
            v.push(n);
            let nbs = ns.scan(n);
            for (let s of nbs) {
                if (!v.includes(s)) {
                    spl[snl.indexOf(s)] = n;
                    q.push(s);
                }
            }
        }
        return spl;
    };

    let start = ns.args[0],
        end = ns.args[1],
        path = [end],
        snl = ns.read('/data/statistician.graph.txt').split(',');

    snl.push('home');
    let spl=gPathList(snl, start);

    while(path[path.length-1] != start) {
        let last=path[path.length-1],
            next=spl[snl.indexOf(last)];
        path.push(next);
    }
    path.reverse();

    let connect = "";
    for (let hop of path) { connect += `connect ${hop}; `; }
    ns.tprint(connect);
}
