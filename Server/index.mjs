import Hyperswarm from "hyperswarm";
import goodbye from "graceful-goodbye";
import b4a from "b4a";
import Corestore from "corestore";
import Hyperbee from "hyperbee"
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import Dotenv from 'dotenv';

Dotenv.config();

const topic = b4a.from(process.env.TOPIC, "hex");
const beeKey = b4a.from(process.env.BEE_KEY, "hex");
const store = new Corestore("./server-storage");

const swarm = new Hyperswarm();
const discovery = swarm.join(topic);

discovery.flushed().then(() => {
    console.log('joined topic:', b4a.toString(discovery.topic, 'hex'));
});

swarm.on('connection', conn =>
    store.replicate(conn)
);

const core = store.get({ key: beeKey })

const bee = new Hyperbee(core, { keyEncoding: "utf-8", valueEncoding: "utf-8" });
await core.ready();

goodbye(() => {
    swarm.destroy();
    store.close();
    core.close();
})

const app = express();

const server = createServer(app);

const io = new SocketIOServer(server, { cors: { origin: '*' } });

setInterval(async () => {
    const data = {};
    const stream = bee.createReadStream();
    for await (const { key, value } of stream) {
        // data[key] = value;
        const [zone, rack, server] = key.split("/");
        if (!data[zone]) {
            data[zone] = {};
        }
        if (!data[zone][rack]) {
            data[zone][rack] = {};
        }
        data[zone][rack][server] = value;
    }
    io.emit("data", data);
}, 1000)

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Started server on port:${port}`);
});

