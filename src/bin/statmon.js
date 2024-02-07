import * as store from "/lib/store.js";

let ns;

async function _log(fn, msg) {
    await ns.print(`[statmon:${fn}] => ${msg}`);
}

async function _buildGraph() {
    await _log('_buildGraph', 'updating source server list');
    let v = [], t = ['home'], p = ns.getPurchasedServers();
    p.push('home');
    p.push('darkweb');

    while (t && t.length) {
        const c = t.shift(), nts = ns.scan(c); v.push(c);
        nts.forEach(nt => {if (!v.includes(nt) && !t.includes(nt)) {t.push(nt);}});
    }
    v = v.filter(e => !p.includes(e));

    store.setItem('hosts', v);
}

async function _updateRooted() {
    await _log('_updateRooted', 'updating rooted server list');
    const hosts = store.getItem('hosts'),
          rooted = hosts.filter(host => ns.hasRootAccess(host));

    store.setItem('rooted', rooted);
}

async function _updateBackdoors() {
    await _log('_updateBackdoors', 'updating backdoored server list');
    const hosts = store.getItem('hosts');
    let backdoors = [];

    for (const host of hosts) {
        const s = ns.getServer(host);
        if (s.backdoorInstalled) {
            backdoors.push(host);
        }
    }

    store.setItem('backdoors', backdoors);
}

async function _updateTargets() {
    await _log('_updateTargets', 'updating target server list');
    const hosts = store.getItem('hosts'),
          rooted = store.getItem('rooted'),
          HL = ns.getHackingLevel(),
          targets = hosts.filter(host => !rooted.includes(host)).filter(host => HL >= ns.getServerRequiredHackingLevel(host));

    store.setItem('targets', targets);
}

async function _updateServerAttributes() {
    await _log('_updateServerAttributes', 'updating server attributes');
    const hosts = store.getItem('hosts');

    for (const host of hosts) {
        const ram = ns.getServerMaxRam(host),
              money = ns.getServerMaxMoney(host),
              skill = ns.getServerRequiredHackingLevel(host);

        store.setItem(`${host}:ram`, ram);
        store.setItem(`${host}:money`, money);
        store.setItem(`${host}:skill`, skill);
    }
}

async function _updateHostAttributes() {
    await _log('_updateHostAttributes', 'updating host attributes');
    const cash = ns.getServerMoneyAvailable('home'),
          ram = ns.getServerMaxRam('home');

    store.setItem('home:ram', ram);
    store.setItem('home:money', cash);
}

async function _updatePlayerAttributes() {
    await _log('_updatePlayerAttributes', 'updating player attributes');
    const player = ns.getPlayer();

    store.setItem('player:hp', player.hp);
    store.setItem('player:max-hp', player.max_hp);
    store.setItem('player:strength', player.strength);
    store.setItem('player:defense', player.defense);
    store.setItem('player:dexterity', player.dexterity);
    store.setItem('player:agility', player.agility);
    store.setItem('player:charisma', player.charisma);
    store.setItem('player:intelligence', player.intelligence);

    store.setItem('player:location', player.city);
    store.setItem('player:karma', ns.heart.break());
    store.setItem('player:factions', player.factions);

    store.setItem('player:has-tor', player.tor);
    store.setItem('player:has-wse', player.hasWseAccount);
    store.setItem('player:has-tix', player.hasTixApiAccess);
    store.setItem('player:has-4s-data', player.has4SData);
    store.setItem('player:has-4s-tix', player.has4SDataTixApi);

    let tr = eval('document').getElementById('overview-extra-hook-0'),
        td = eval('document').getElementById('overview-extra-hook-1');
    let headers = ['<br />'],
        values = ['<br />'];
    if (store.enabled('enable_share')) {
        let sh = ns.getSharePower();
        headers.push('Share');
        values.push(`${sh.toFixed(2)}`);
    }

    if (store.enabled('enable_karma')) {
        let karma = ns.heart.break();
        headers.push('Karma');
        values.push(`${karma.toFixed(2)}`);
    }

    tr.innerHTML = headers.join('&nbsp;<br />');
    td.innerHTML = values.join('<br />');
}

async function _configureStatmon() {
    if (!store.toggleExists('enable_share')) {
        store.setToggle('enable_share', true);
    }

    if (!store.toggleExists('enable_karma')) {
        store.setToggle('enable_karma', true);
    }
}

/**
    * @param {NS} _ns
    */
export async function main(_ns) {
    ns = _ns;

    await _log('main', 'starting statmon daemon');
    await _configureStatmon();
    await _buildGraph();
    await _updateServerAttributes();
    await ns.sleep(100);

    while (true) {
        await _updateRooted();
        await _updateBackdoors();
        await _updateTargets();
        await _updateHostAttributes();
        await _updatePlayerAttributes();

        await ns.asleep(500);
    }
}
