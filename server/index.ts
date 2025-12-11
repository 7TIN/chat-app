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
  roomId?: string | null;
  userId?: string | null;
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
  roomList.push(roomId);
  return roomId;
}

const checkUser = () => {
  let userId = Math.random()
    .toString(36)
    .substring(2, 2 + 8);
  let isUserExists = socketsList.some((s) => s.userId == userId);
  while (isUserExists) {
    userId = Math.random()
      .toString(36)
      .substring(2, 2 + 8);
    if (socketsList.some((s) => (s.userId == userId) === false)) {
      isUserExists = false;
    }
  }
  return userId;
};

function checkRoom(roomId: string) {
  const res = roomList.includes(roomId);
  return res;
}

ws.on("connection", (socket: CustomeSocket) => {

  const userId = checkUser();
  socket.userId = userId;
  socket.send(JSON.stringify({message : "Connected to server", type : "welcome", userId : socket.userId}))

  socketsList.push(socket);
  
  socket.on("message", (data) => {
    let parsed = JSON.parse(data.toString());
    if (parsed.type === "create") {
      console.log(parsed);
      if (parsed.roomId === null && parsed.type === "create") {
        const roomId = createRoom();
        socket.roomId = roomId;
        socket.send(
          JSON.stringify({ message: "Room Created", roomId: roomId })
        );
      }
    } else if (parsed.type === "join") {
      if (checkRoom(parsed.roomId)) {
        socket.roomId = parsed.roomId;
        socket.send(
          JSON.stringify({
            type: "join room",
            message: "Room joined Successfully",
            success: true,
          })
        );
      } else {
        socket.send(
          JSON.stringify({
            type: "join room",
            message: "Room does not exits",
            success: false,
          })
        );
      }
    } else if (parsed.type === "chat") {
      socketsList.map((s) => {
        if (s.roomId === socket.roomId) {
          s.send(JSON.stringify({ message: parsed.message, type: "chat", userId : socket.userId }));
        }
      });
    } else {
      socket.send("error");
    }
  });
  socket.on("close", () => {
    socketsList = socketsList.filter((x) => x !== socket);
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
