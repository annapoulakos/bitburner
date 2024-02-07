let ns, corp, command;
const TARGET_INDUSTRY = 'Agriculture',
      DIVISION_NAME = 'moo moo',
      CITIES = [
          'Aevum',
          'Chongqing',
          'Ishima',
          'New Tokyo',
          'Sector-12',
          'Volhaven'
      ],
      JOBS = [
          'Operations',
          'Engineer',
          'Management'
      ],
      MATERIALS = {
          'Real Estate': 27000,
          'AI Cores': 75,
          'Hardware': 125
      },
      PRODUCTS = [
          'Food',
          'Plants'
      ];

const FN_MAP = {
    'create-division': _createDivision,
    expand: _expand,
    'expand-all': _expandAll
};


export function autocomplete(data, args) {
	return [
		...Object.keys(FN_MAP)
	];
}

async function _createDivision(flags) {
    try {
        corp.getDivision(DIVISION_NAME);
        ns.toast('Division already exists', 'warn', 3000);
    } catch {
        corp.expandIndustry(TARGET_INDUSTRY, DIVISION_NAME);
        ns.toast(`[corp:create-division] => Created division ${DIVISION_NAME}`);
    }

    if (!corp.hasUnlock('Smart Supply')) {
        corp.purchaseUnlock('Smart Supply');
    }
}

async function _noop(flags) {}
const log = async (msg) => { await ns.print(`[corp:${command}] => ${msg}`) };
const newCity = async (city) => {
    const d = corp.getDivision(DIVISION_NAME);
    if (!d.cities.includes(city)) {
        corp.expandCity(DIVISION_NAME, city);
        await log(`expanded division to ${city}`);
    }
};
const purchaseWarehouse = async (city) => {
    if (!corp.hasWarehouse(DIVISION_NAME, city)) {
        corp.purchaseWarehouse(DIVISION_NAME, city);
        await log(`purchased warehouse in ${city}`);
    }
};
const upgradeWarehouse = async (city) => {
    let whSize = corp.getWarehouse(DIVISION_NAME, city).size;
    while (whSize < 300) {
        await log('purchasing warehouse upgrade');
        corp.upgradeWarehouse(DIVISION_NAME, city, 1);
        whSize = corp.getWarehouse(DIVISION_NAME, city).size;
        await ns.asleep(1);
    }
};
const purchaseMaterials = async (city) => {
    for (const [mat,qty] of Object.entries(MATERIALS)) {
        const cur = corp.getMaterial(DIVISION_NAME, city, mat).stored;
        await log(`currently have ${cur} / ${qty} ${mat}`);
        if (cur < qty) {
            await log(`purchasing ${qty - cur} ${mat}`);
            corp.bulkPurchase(DIVISION_NAME, city, mat, qty - cur);
        }
    }
};
const enableSmartSupply = async (city) => {
    corp.setSmartSupply(DIVISION_NAME, city, true);
    await log(`Smart Supply enabled in ${city}`);
};
const configureSales = async (city) => {
    for (const product of PRODUCTS) {
        await log(`configuring sales for ${product} in ${city}`);
        corp.sellMaterial(DIVISION_NAME, city, product, 'MAX', 'MP');
    }
};
const hireEmployees = async (city) => {
    for (const job of JOBS) {
        await log(`hiring employee in ${city} for ${job}`);
        corp.hireEmployee(DIVISION_NAME, city);
        await corp.setAutoJobAssignment(DIVISION_NAME, city, job, 1);
    }
};

async function _expand(flags) {
    await ns.print(`[corp:expand] => expanding to ${flags.city}`);

    if (CITIES.includes(flags.city)) {
        await newCity(flags.city);
        await purchaseWarehouse(flags.city);
        await upgradeWarehouse(flags.city);
        await purchaseMaterials(flags.city);
        await enableSmartSupply(flags.city);
        await configureSales(flags.city);
        await hireEmployees(flags.city);
    }
}

async function _expandAll(flags) {
    for (const city of CITIES) {
        await log(`expanding to ${city}`);
        await newCity(city);
        await purchaseWarehouse(city);
        await upgradeWarehouse(city);
        await purchaseMaterials(city);
        await enableSmartSupply(city);
        await configureSales(city);
        await hireEmployees(city);
    }
}

/** @param {NS} ns */
export async function main(_ns) {
    ns = _ns;
    corp = eval("ns.corporation");
    ns.tail();

    command = ns.args.shift();
    const fn = FN_MAP[command] || _noop,
          flags = ns.flags([
              ['city', '']
          ]);

    await fn(flags);
}
