const WebSocket = require("ws");
const cli = require("./user")
let client = cli.Client.generateDefaultUser()

// Create server
const server = new WebSocket.Server({port: 8080, clientTracking: true})

// Event when WSS is listening new websockets
server.on("listening", () => {
    console.log("Start listening...")
})

// Called when socket is connected to server
server.on("connection", (ws) => {
    ws.on("message", (data) => {
        let parsedJson = JSON.parse(data)

        if (parsedJson.msgType === "init") {
            client = new cli.Client(parsedJson.name, parsedJson.color)
            sendInitMsg()
        } else broadcastAll(data)
    })
})

function sendInitMsg() {
    let data =
        JSON.stringify({
            name: client.name,
            color: client.color,
            msg: `Welcome, ${client.name}`,
            msgType: "init"
        })

    broadcastAll(data)
}

// Show message all connected users
function broadcastAll(data) {
    server.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}