const rdLine = require("readline")
const WebSocket = require("ws")
const cli = require("./user")
const colorUtils = require("./utils");

let colorify = (color, what) => colorUtils.colorify(color, what)

const url = "ws://localhost:8080"
let client = cli.Client.generateDefaultUser()

const cmd = rdLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

cmd.question("Name yourself: ", (name) => {
    cmd.question("Choose your color in hex: ", (hex) => {
        client = new cli.Client(name, hex)
        let socket = new WebSocket(url)

        // Called when this socket is connected to server
        socket.on("open", () => {
            socket.send(JSON.stringify({
                name: client.name,
                color: client.color,
                msgType: "init"
            }))
        })

        // Called when you receiver message from server (WSS)
        socket.on("message", (msg) => {
            let data = JSON.parse(msg)
            if (data.msgType === "init") {
                console.log(`${colorify("#e735ac", data.msg)}`)
            } else {
                console.log(`${colorify(data.color, data.name)}: ${data.msg}`)
            }
        })

        // For sending message in client side
        function sendMessage(msg) {
            const data = {
                name: client.name,
                color: client.color,
                msg: msg,
                type: "message"
            }
            socket.send(JSON.stringify(data))
        }

        // When websocket is connected user can print message
        try {
            cmd.on("line", txt => {
                sendMessage(txt)
            })
        } catch (e) {
            console.log(e)
            process.exit(-1)
        }
    })
})
