import * as utils from "/scripts/lib/utilities.js";

let ns = null;

function _find(edges, start, end) {
    const graph = edges.reduce((map, [start, end, cost]) => {
            if (map.has(start)) {
                map.get(start).push([end,cost]);
            } else {
                map.set(start, [[end,cost]]);
            }
            return map
        }, new Map());
    const paths = [];
    const find = (start, pathSoFar = [start], costSoFar = 0) => {
        for (const [dest,cost] of graph.get(start)) {
            const newPath = pathSoFar.concat(dest);
            if (dest === end) {
                paths.push([newPath.join('.'), costSoFar + cost]);
            } else {
                find(dest, newPath, costSoFar + cost);
            }
        }
    }

    find(start);
    return paths.reduce((a,b) => a[1] > b[1]? b: a);
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
    for (let hop of path) { connect += `connect ${hop};`; }
    ns.tprint(connect);


    // utils.log(`[test::main] => generating node paths`);
    // let visited = [],
    //     targets = ['home'],
    //     graph = {};

    // while (targets && targets.length) {
    //     const target = targets.shift(),
    //           new_targets = ns.scan(target);

    //     utils.log(`[test::main] => ${target} -> ${new_targets.length}`);
    //     visited.push(target);
    //     graph[target] = new_targets.map(t => t);

    //     new_targets.forEach(nt => {
    //         if (!visited.includes(nt) && !targets.includes(nt)) { targets.push(nt); }
    //     });
    // }

    // const edges = [],
    //       start = ns.args[0],
    //       end = ns.args[1];
    // for (const [k,v] in Object.entries(graph)) {
    //     utils.log(`[${k}] => ${v}`)
    //     if (v && v.length) { v.forEach(e => edges.push([k,e,1])); }
    // }

    // const path = _find(edges, start, end);
    // utils.log(path);
}
