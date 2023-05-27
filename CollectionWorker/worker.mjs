import Hyperswarm from "hyperswarm";
import goodbye from "graceful-goodbye";
import crypto from "hypercore-crypto";
import b4a from "b4a";
import Hyperbee from "hyperbee";
import Corestore from "corestore";
import Dotenv from "dotenv";

Dotenv.config();

const agentTopic = process.env.AGENT_TOPIC
    ? b4a.from(process.env.AGENT_TOPIC, "hex")
    : crypto.randomBytes(32);
const beeTopic = process.env.BEE_TOPIC
    ? b4a.from(process.env.BEE_TOPIC, "hex")
    : crypto.randomBytes(32);

const store = new Corestore("./collection-worker-storage");

const core = store.get({ name: "collection-worker" });


await core.ready();

const db = new Hyperbee(core, { keyEncoding: "utf-8", valueEncoding: "utf-8" });

await db.ready();

const agentSwarm = new Hyperswarm({
    maxPeers: 200,
    maxServerSockets: 200,
    maxClientSockets: 200,
    maxParallel: 200,
    jitter: 10000,
    backoff: {
        min: 1000,
        max: 10000,
        retries: 10,
    },
    debug: true
});
const beeSwarm = new Hyperswarm();
goodbye(() => {
    agentSwarm.destroy();
    beeSwarm.destroy();
    db.close();
    core.close();
    store.close();
});


const agentDiscovery = agentSwarm.join(agentTopic);
const beeDiscovery = beeSwarm.join(beeTopic);

agentDiscovery.flushed().then(() => {
    console.log("Agent agentTopic: ", b4a.toString(agentTopic, "hex"));
});

beeDiscovery.flushed().then(() => {
    console.log("Bee topic: ", b4a.toString(beeTopic, "hex"));
    console.log("Bee key: ", b4a.toString(core.key, "hex"));
});

agentSwarm.on("connection", (conn, info) => {
    const key = b4a.toString(conn.remotePublicKey, "hex");
    let name = "";
    conn.on("data", (data) => {
        try {
            let msg = JSON.parse(data.toString());
            if (msg.event === "register-agent") {
                console.log(
                    `[${key}] registered as ${msg.zone}/${msg.rack}/${msg.server}`
                );
                name = msg.zone + "/" + msg.rack + "/" + msg.server;
            }
            else if (msg.event === "temperature") {
                console.log(`${name} - ${msg.temperature}`)
                db.put(name, msg.temperature);
            }
        } catch (err) {
            console.error(err);
        }
    });
    conn.on("close", () => {
        console.log(`[${key}] connection closed`);
    }
    );
    conn.on("error", (err) => {
        console.error(`[${key}] connection error: ${err}`);
    });
});

agentSwarm.on("connection-closed", (conn, info) => {
    console.log("connection closed");
});



beeSwarm.on("connection", (conn, info) => {
    store.replicate(conn);
});


//add error handling on the swarm
agentSwarm.on("error", (err) => {
    console.error(err);
});

beeSwarm.on("error", (err) => {
    console.error(err);
});