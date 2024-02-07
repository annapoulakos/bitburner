# BitBurner Scripts

This is just a collection of my random scripts that I use regularly for BitBurner.

Things may or may not work. No guarantees.

## Aliases

This is a small list of aliases I use to make things a bit easier to deal with:

* `alias service='/bin/service.js'`
* `alias config='/bin/config.js'`
* `alias corp='/bin/corp.js'`
* `alias cxn='/bin/connect.js'`
* `alias ec='/bin/ec.js'`
* `alias list='/bin/list.js'`


## Commands

The following commands are ones I use regularly:

### Service
<details>
<summary><code>service init</code></summary>

This command starts the current set of configured services. Defaults to statmon, rooterd, batchd, and shared.

Configuration is stored as an array in localStorage at `service:init`.
</details>

<details>
<summary><code>service add SERVICE_NAME</code></summary>

This command adds `SERVICE_NAME` to the init list for services to be started with `service init`.

Configuration is stored as an array in localStorage at `service:init`.

> [!NOTE]
> This command does **NOT** start the provided service.
</details>

<details>
<summary><code>service remove SERVICE_NAME</code></summary>

This command removes `SERVICE_NAME` from the init list for services to be started with `service init`.

Configuration is stored as an array in localStorage at `service:init`.

> [!NOTE]
> This command does **NOT** stop the provided service.
</details>

<details>
<summary><code>service start SERVICE_NAME</code></summary>

This command starts the provided service, unless it is already running.
</details>

<details>
<summary><code>service stop SERVICE_NAME</code></summary>

This command stops the provided service, as long as it is alredy running.
</details>

<details>
<summary><code>service restart SERVICE_NAME</code></summary>

This command will stop the provided service, if it is running, and then start the service back up.
</details>

<details>
<summary><code>service list</code></summary>

This command will list two sections: the first is a list of currently running services, the second is a list of services configured to be started during `service init`.

Configuration is stored as an array in localStorage at `service:init`. Runnig services is stored as an array in localStorage at `service:running`.
</details>


### Configuration
<details>
<summary><code>config set KEY VALUE</code></summary>

Sets the given configuration `KEY` to the specified `VALUE`.

> [!IMPORTANT]
> `KEY` should follow this format: `PREFIX:SUFFIX` where the prefix is a common label and the suffix is the use for the configuration item. For example, `player:hp` is the key for the player's current HP value (from statmon).

The config utility stores all data in localStorage at the provided key.
</details>

<details>
<summary><code>config get KEY</code></summary>

Returns the entry at `KEY` or null if it doesn't exist.
</details>

<details>
<summary><code>config init ARG1 [ARG2] [...ARG3]</code></summary>

This command allows multiple configuration items to be passed in when called.

> [!IMPORTANT]
> Arguments must be in the form of `key=value` where the key should follow key naming conventions above, and value can be anything. If there are spaces or special characters in the value, you should enclose it in quotes.

*Example*
`config init myservice:timeout=1000 myservice:enable-metrics=true`

</details>

<details>
<summary><code>config remove KEY</code></summary>

This command removes the provided key from the configuration.
</details>

<details>
<summary><code>config delete PREFIX</code></summary>

This command removes all keys with the provided prefix from the configuration.

*Example*
`config delete myservice` would delete all keys that start with `myservice` like `myservice:timeout` and `myservice:enable-metrics` while leaving `otherservice:timeout` intact.

`config delete myservice:timeout` acts like `config remove myservice:timeout` if there are no other keys with that prefix.
</details>


### Corporation

This command manages corporation logic. I follow a very simple plan for corporations, so this may not be as useful to you. See [Corporations][docs/corporations.md] for more information.

> [!NOTE]
> This is only available if you are on BitNode 4 or have SourceFile 4.3

<details>
<summary><code>corp create-division</code></summary>

This command creates an Agricultural division and unlocks Smart Supply.
</details>

<details>
<summary><code>corp expand --city CITY_NAME</code></summary>

This command expands the Agricultural division to the provided city. It also performs purchase, upgrades and configuration for the provided city.
</details>

<details>
<summary><code>corp expand-all</code></summary>

This command runs the `expand` operation against all six cities.
</details>

### Connect

<details>
<summary><code>cxn TARGET_SERVER</code></summary>

This command returns a list of `connect X ;` where X is each step of the journey from home to the target server. You can copy this and paste it into your command line input.
</details>

### Elastic Compute

<details>
<summary><code>ec config -l</code></summary>

This command lists all current configuration items that are editable.
</details>

<details>
<summary><code>ec config --items ARG [--items ARG]</code></summary>

This command allows you to change a given configuration item, using `key=value`. You can pass multiple `--items` to this command.

*Allowed configuration items*
* `hosts`: The number of hosts to have in the cluster (max 25)
* `ram`: The amount of RAM, in Gb, to use for each host
* `prefix`: The prefix to use for each host, i.e. `share-host` or `batch-host`
</details>

<details>
<summary><code>ec reset-config</code></summary>

This command resets the configuration to the defaults:

* `hosts`: 4
* `ram`: 256
* `prefix`: anna
</details>

<details>
<summary><code>ec cluster --up</code></summary>

This command spins up the cluster based on the stored configuration. This command additionally deploys the stored package details to those servers and starts that package on each server.
</details>

<details>
<summary><code>ec cluster --up --deploy PACKAGE</code></summary>

This command spins up the cluster and deploys the specified package to each server.

Currently, there is only one package available.
</details>

<details>
<summary><code>ec cluster --down</code></summary>

This command spins down the cluster after killing all scripts on each host.
</details>

<details>
<summary><code>ec cluster --deploy PACKAGE</code></summary>

This command deploys the specified package to each server in the cluster.
</details>

<details>
<summary><code>ec refresh </code></summary>

This command refreshes individual server configurations stored in localStorage. Useful when a cluster doesn't spin up correctly.
</details>


### List

<details>
<summary><code>list hosts</code></summary>

This command lists all hosts on the network except for purchased servers.
</details>


<details>
<summary><code>list rooted</code></summary>

This command lists all hosts on the network that have been rooted except for purchased servers.
</details>


<details>
<summary><code>list backdoors</code></summary>

This command lists all hosts on the network that have had a backdoor installed except for purchased servers.
</details>


<details>
<summary><code>list ram</code></summary>

This command lists the RAM of all hosts on the network except for purchased servers.
</details>


<details>
<summary><code>list money</code></summary>

This command lists the available cash for all hosts on the network except for purchased servers.
</details>
