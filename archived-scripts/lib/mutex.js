
function _hash(...args) {
    const data = args.join('');

    let self = 0, i, chr;
    for (i=0; i< data.length; i++) {
        self = ( ((self << 5) - self) + data.charCodeAt(i) )|0;
    }
    return `${self}`;
}

/**
 * @param {NS} ns
 * @param {string} filename
 * @param {CallableFunction} fn
 **/
export async function lock(ns, filename, fn, ...args) {
    const hashed = _hash(filename, ns.args),
          lockFile = `/locks/${hashed}.txt`;

    // Check if currently locked and throw if true
    if (await ns.read(lockFile).length > 0) {
        throw `lock exists for ${lockFile}`;
    }

    // Not locked, so execute function
    try {
        await ns.write(lockFile, hashed, "w");
        await fn(args);
    } finally {
        // ALWAYS clear the lock, even on failures
        ns.clear(lockFile);
    }
}
