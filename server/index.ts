import { WebSocketServer, WebSocket } from "ws";

const ws = new WebSocketServer({ port: 8080 });

let socketsList = [];

//boardcasting 
ws.on("connection", (socket) => {
  socketsList.push(socket);
  const length = socketsList.length;
  // socket.send(socketsList.length);
  socketsList.map((s, index) => {
    s.send(length);
  });

  socket.on("message", (e) => {
    socketsList.map((s) => {
      s.send(e.toString());
    });
  });
});

// normal Ping Pong 

// ws.on("connection", function connection(socket) {
//   socket.on("ping", () => {
//     socket.send("ping from ping");
//   });
//   socket.on("pong", () => {
//     socket.send("pong from pong");
//   });
//   socket.on("open", () => {
//     socket.send("ping");
//   });
//   socket.on("message", () => {
//     socket.send("Message");
//   });
// });

interface socket extends WebSocket {
  type : string,
  payload? : {
    message? : string,
    roomId? : string
  }
}


ws.on('connection', (socket: socket) => {
  
})




// let userCount = 0;
// let socketsList: socket[] = [];
// ws.on("connection", (socket: socket) => {
//   if (
//     socket.type === "create"
//     // && socket.payload?.roomId === null
//   ) {
//   }
// });

// ws.on("connection", (socket: socket) => {
//   if (socket.type === "join" && socket.payload?.roomId) {

//   }

//   if (socket.type === "chat") {
//     const msg = socket.payload?.message ?? "";
//     socket.send(msg);
//   }

//   // socketsList.push(socket);
//   // userCount = userCount + 1;

//   // socket.on('message', (e) => {
//   //     // console.log(e.toString());

//   //     socketsList.forEach((s) => {
//   //         s.send("Sever: " + e.toString())
//   //     })
//   // socket.send("yooo");

//   // })
// });
// console.log("Hello via Bun!");
