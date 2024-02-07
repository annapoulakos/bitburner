let ns;

const FN_MAP = {
    run: _run,
    hijinx: _hijinx
};

const FLAGS = [
    ['test', ''],
    ['l', false]
];

async function _noop(flags) {};

async function _run(flags) {
    await ns.tprint(flags);
}

async function _hijinx(flags) {
    flags.l && await ns.tprint('interesting...');
}

export async function main(_ns) {
    ns = _ns;

    const command = ns.args.shift(),
          fn = FN_MAP[command] || _noop,
          flags = ns.flags(FLAGS);

    await fn(flags);
}
