import { WebSocketServer, WebSocket } from "ws";

const ws = new WebSocketServer({port:8080});

let userCount = 0;
let socketsList: WebSocket[] = [];

ws.on('connection', (socket : WebSocket) => {

    socketsList.push(socket);
    userCount = userCount + 1;

    socket.on('message', (e) => {
        // console.log(e.toString());

        socketsList.forEach((s) => {
            s.send("Sever: " + e.toString())
        })
    // socket.send("yooo");

    })
})
// console.log("Hello via Bun!");