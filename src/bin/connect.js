import * as store from '/lib/store.js';

let ns = null;

export function autocomplete(data, args) {
    return [
        ...data.servers
    ];
}

function gPathList(snl, start) {
    let spl = snl.map(() => ""),
        v = [],
        q = [start];

    while (q.length > 0) {
        let node = q.shift();
        v.push(node);

        let newNodes = ns.scan(node);
        for (let s of newNodes) {
            if (!v.includes(s)) {
                spl[snl.indexOf(s)] = node;
                q.push(s);
            }
        }
    }

    return spl;
}

export function getPath(start, end) {
    let path = [end],
        snl = store.getItem('hosts');

    snl.unshift(start);
    let spl = gPathList(snl, start);

    while (path[path.length-1] != start) {
        let last = path[path.length-1],
            next = spl[snl.indexOf(last)];

        path.push(next);
    }

    path.reverse();
    return path;
}

export async function main(_ns) {
    ns = _ns;

    let path = getPath(ns.getHostname(), ns.args[0]);

    let connect = "";
    for (let hop of path) { connect += `connect ${hop}; `; }
    await ns.tprint(connect);
}
