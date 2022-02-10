import * as utils from "/lib/utilities.js";
import * as store from '/lib/store.js';

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

    let start = 'home',
        end = ns.args[0],
        path = [end],
        snl = store.getItem('hosts');

    snl.unshift('home');
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
