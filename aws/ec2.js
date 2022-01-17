import * as utils from "aws/aws-utils.js";

export const HELP = 'aws ec2 COMMAND [OPTIONS]';

const FLAGS = [
    ['size', 32],
];
const SERVER_NAMES = [
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
    'af-south-1',
    'ap-east-1',
    'ap-southeast-3',
    'ap-south-1',
    'ap-northeast-3',
    'ap-northeast-2',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-northeast-1',
    'ca-central-1',
    'eu-central-1',
    'eu-west-1',
    'eu-west-2',
    'eu-south-1',
    'eu-west-3',
    'eu-north-1',
    'me-south-1',
    'sa-east-1',
    'us-gov-east-1',
    'us-gov-east-2',
    'bitburner-east-1',
];

/**
 * Displays help text
 * @param {NS} ns
 */
function _help(ns) {
    const subCommandHelp = {
        help: 'aws ec2 help',
        'create-instance': 'aws ec2 create-instance --size 32'
    };

    for (const sub in subCommandHelp) {
        ns.tprint(`[${sub}] => ${subCommandHelp[sub]}`);
    }
    return [];
}

/**
 * Creates a new instance, if possible
 *      size passed in via --size INT option (default: 32Gb)
 * @param {NS} ns
 */
function _createInstance(ns) {
    utils.log('[ec2:create-instance] => creating a new instance...');

    const current = ns.getPurchasedServers(),
          cost = ns.getPurchasedServerCost(utils.get("size", 32)),
          cashOnHand = ns.getServerMoneyAvailable("home");

    function _nextServer(current) {
        const available = SERVER_NAMES.filter(f => !current.includes(f)),
              next = available[Math.floor(Math.random()*available.length)] || null;

        utils.log(`[ec2:create-instance:_nextServer] => found ${next}`);
        return next;
    }

    if (cashOnHand > cost) {
        utils.log(`[ec2:create-instance] => funding cleared; generating available hostname...`);
        const hostname = _nextServer(current);

        if (hostname) {
            utils.log(`[ec2:create-instance] => valid hostname found (${hostname}); purchasing...`);
            ns.purchaseServer(hostname, utils.get("size", 32));
            return [hostname]
        } else {
            throw 'server creation error';
        }
    } else {
        throw `not enough available funds: ${cashOnHand} / ${cost}`;
    }
}

/**
 * @param {NS} ns
 **/
export async function main(ns) {
    utils.configure(ns, FLAGS);

    const command = ns.args[0];

    const fn = {
        'create-instance': _createInstance,
    }[command] || _help;

    const output = fn(ns);

    for (line of output) {
        ns.print(line);
    }
}
