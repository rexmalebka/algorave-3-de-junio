const { Server: OSCServer } = require('node-osc');
const { Server: SocketServer } = require("socket.io");

let hist = {}

const io = new SocketServer(3030, {
    cors: {
        origin: '*'
    }
});

const osc = new OSCServer(3000, '0.0.0.0', () => {
    console.log('OSC Server is listening on port 3000');
});

io.on("connection", (socket) => {
    console.log(`connected |${socket.id}`)

    io.emit("hist", hist)
});

osc.on('/hist', (msg) => {
    const hist_data = msg.slice(1)
    const author = hist_data.length > 1 ? hist_data[0] : 'anon'
    const text = (hist_data.length > 1 ? hist_data[1] : hist_data[0]) || ""
    console.log(`hist received |${author}| "${text}"`)

    hist[author] = text

    io.emit("hist", hist)
});

osc.on('/bloom', (msg)=>{
    const strength = msg[1]
    io.emit("bloom", strength)
})

osc.on('/fbrotation', (msg)=>{
    const rotation = msg[1]
    io.emit("fbrotation", rotation)
})

osc.on('/fboffset', (msg)=>{
    const offset = msg.slice(1)
    console.debug(offset)
    io.emit("fboffset", offset)
})



osc.on('/hist-bye', (msg) => {
    const hist = msg.slice(1)
    const author = hist.length > 1 ? hist[0] : 'anon'
    if (hist[author]) {
        delete hist[author]
    }
});
