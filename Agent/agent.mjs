import Hyperswarm from 'hyperswarm';
import b4a from 'b4a';
import goodbye from "graceful-goodbye"

//get zone, rack, server and key from the command line
const zone = process.env.ZONE;
const rack = process.env.RACK;
const server = process.env.SERVER;
const key = b4a.from(process.env.KEY, "hex");

console.log(`zone: ${zone}, rack: ${rack}, server: ${server}, key: ${key.toString('hex')}`);

const swarm = new Hyperswarm({
    jitter: 10000,
    ephemeral: true,
});

goodbye(() => {
    swarm.leave(key)
});

const discovery = swarm.join(key, { client: true, server: false });

discovery.flushed().then(() => {
    console.log('joined topic:', b4a.toString(discovery.topic, 'hex'));
});

const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let toMaintain = getRandom(2, 20)
let lastTime = null;
let lastTemperature = null;
const getTemperature = () => {
    if (lastTime === null) {
        lastTime = Date.now();
        lastTemperature = getRandom(30, 100);
    }
    const now = Date.now();
    const diff = now - lastTime;
    if (diff > toMaintain * 1000) {
        lastTime = now;
        lastTemperature = getRandom(30, 100);
    }
    return lastTemperature;
}

swarm.on('connection', (conn) => {
    console.log('got connection registering');
    conn.write(JSON.stringify({
        event: 'register-agent',
        zone: zone,
        rack: rack,
        server: server,
    }));

    setInterval(() => {
        const temperature = getTemperature()
        console.log('Writing temperature to the swarm - ', temperature)
        conn.write(JSON.stringify({
            event: 'temperature',
            temperature: temperature,
        }));
    }, 10000);

    conn.on('error', (err) => {
        console.log('connection error', err);
    })

    conn.on('close', () => {
        console.log('connection closed');
    })
});
