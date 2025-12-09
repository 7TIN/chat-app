import type { Socket } from "bun";
import { WebSocketServer, WebSocket } from "ws";

const ws = new WebSocketServer({ port: 8080 });

// let socketsList: socket[] = [];
const roomList: string[] = [];

// interface socket extends WebSocket {
//   type: string;
//   payload?: {
//     message?: string | null;
//     roomId?: string | null;
//   };
// }

//boardcasting
// ws.on("connection", (socket) => {
//   socketsList.push(socket);
//   const length = socketsList.length;
//   // socket.send(socketsList.length);
//   socketsList.map((s, index) => {
//     s.send(length);
//   });

//   socket.on("message", (e) => {
//     socketsList.map((s) => {
//       s.send(e.toString());
//     });
//   });
// });

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

interface CustomeSocket extends WebSocket {
  // type?: string | null;
  // message?: string | null;
  roomId?: string | null;
}

let socketsList: CustomeSocket[] = [];

function createRoom() {
  let roomId = Math.floor(10000 + Math.random() * 90000).toString();
  let isRoomExists = roomList.includes(roomId);
  while (isRoomExists) {
    roomId = Math.floor(10000 + Math.random() * 90000).toString();
    if (roomList.includes(roomId) === false) {
      isRoomExists = false;
      // return
    }
  }
  return roomId;
}

ws.on("connection", (socket: CustomeSocket) => {
  socketsList.push(socket);
  socket.on("message", (data) => {
    let parsed = JSON.parse(data.toString());

    if (parsed.type === "create") {
      console.log(parsed);
      if (parsed.roomId === null && parsed.type === "create") {
        const roomId = createRoom();
        console.log(roomId);
        socket.roomId = roomId;
        console.log(socket);
        socket.send(
          JSON.stringify({ message: "Room Created", roomId: roomId })
        );
      }
    } else if (parsed.type === "join") {
      socket.roomId = parsed.roomId;
      console.log(parsed);
      console.log(socket);
      socket.send("join");
    
    } else if (parsed.type === "chat") {

      socketsList.map((s) => {
        if(s.roomId === socket.roomId){
          s.send(parsed.message);
        }
      })
      console.log(parsed);
      // socket.send("chat");
      
    } else {
      socket.send("error");
    }
  });
});

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
