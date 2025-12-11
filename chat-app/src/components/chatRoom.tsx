import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";

interface customeWebSocket extends WebSocket {
  roomId?: string | null;
}

interface userMessage {
  userId: string;
  message: string;
}

// export const LoadingState = ({roomCode , loading, success } : {roomCode : string, loading : boolean, success : boolean}) => {
//   return (
//     <>
//       {/* {roomCode && loading && (
//         <div className="rounded-lg border border-neutral-300 border-dashed "></div>
//       )} */}
//       <div className={`rounded-lg border border-neutral-300 border-dashed ${loading ? 'bg-amber-100' : {success}} `}>
//         {!loading && success === false && ("Wrong room code... Enter correct code")}
//       </div>
//     </>
//   );
// };

export const MessageCard = ({
  type,
  message,
}: {
  type: "incoming" | "outgoing";
  message: string;
}) => {
  return (
    <div
      className={`w-full flex justify-end ${
        type === "incoming" ? " justify-start" : "justify-end"
      } `}
    >
      <div
        className={` w-fit flex text-center px-3 py-2 rounded-lg font-mono ${
          type === "incoming"
            ? "bg-neutral-800 text-neutral-50 justify-start"
            : "bg-neutral-200 text-neutral-900 justify-end"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export function ChatRoom() {
  const socketRef = useRef<customeWebSocket | null>(null);
  const [loading, setLoading] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [roomCode, setRoomCode] = useState<string>("");
  const [messages, setMessages] = useState<userMessage[]>([]);
  const [connected, setConnected] = useState<boolean>(false);
  const [user, setUser] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);


  const scrollToButtom = () => {
    messagesEndRef.current?.scrollIntoView({behavior : "smooth"});
  }

  const handleCreateRoom = () => {
    setLoading(true);
    socketRef.current?.send(JSON.stringify({ type: "create", roomId: null }));
  };

  const handleJoinRoom = () => {
    // setLoading(true);
    socketRef.current?.send(JSON.stringify({ type: "join", roomId: roomCode }));
  };

  const handleSubmitMessage = (e : FormEvent) => {
    e.preventDefault();
    const text = msg.trim();
    if (text.length === 0) return;
    socketRef.current?.send(JSON.stringify({ type: "chat", message: text }));
  };

  const handleInputMsgChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRoomCode(e.target.value);
  };

  useEffect(() => {
    scrollToButtom();
  },[messages])

  useEffect(() => {
    const user = localStorage.getItem("userId");
    if (user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080") as customeWebSocket;

    ws.onopen = () => {
      socketRef.current = ws;
      console.log("Connected");
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "welcome" && socketRef.current) {
        localStorage.setItem("userId", data.userId);
        setUser(data.userId);
      }

      if (data.message === "Room Created" && socketRef.current) {
        // socketRef.current.roomId = data.roomId;
        // ws.roomId = data.roomId;
        setRoomId(data.roomId);
        setLoading(false);
      }
      if (data.type === "join room" && socketRef.current) {
        if (data.success === true) {
          setConnected(true);
        } else {
          toast.error("wrong room code");
          // console.log("wrong room code");
        }
      }
      if (data.type === "chat" && socketRef.current) {
        setMessages((m) => [...m, data]);
      }
    };

    ws.onclose = () => {
      console.log("disconnected");
      setLoading(false);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="w-full">
      <div className="flex w-7xl mx-auto justify-center h-screen items-center">
        {!connected ? (
          <div className="bg-neutral-50 w-xl rounded-lg p-6 border border-neutral-300 flex flex-col gap-y-4 shadow-sm">
            <button
              type="submit"
              disabled={roomId != null}
              onClick={handleCreateRoom}
              className={`w-full p-2 text-center font-semibold  rounded-lg text-neutral-50  ${
                loading
                  ? "bg-neutral-500"
                  : "bg-neutral-800 hover:bg-neutral-700 active:ring-2 active:ring-gray-300 cursor-pointer"
              }  `}
            >
              {loading && roomId === null ? (
                <div className="flex justify-center gap-x-6 font-semibold items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-spin"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Creating Room...
                </div>
              ) : (
                "Create New Room"
              )}
            </button>
            <div className="flex w-full gap-x-3">
              <input
                type="text"
                className="flex-1 bg-neutral-50 border text-center border-neutral-300 rounded-lg p-2 text-neutral-600 font-mono placeholder:text-neutral-500"
                placeholder="Enter Room Code"
                maxLength={5}
                value={roomCode}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                onClick={handleJoinRoom}
                className="text-center font-semibold text-neutral-50 rounded-lg py-2 px-4 bg-neutral-800 hover:bg-neutral-700 active:ring-2 active:ring-gray-300 cursor-pointer"
              >
                Join Chat
              </button>
            </div>
            {roomId && (
              <div className="w-full flex flex-col justify-center items-center bg-neutral-100 rounded-lg py-4">
                <span className="text-neutral-900">Share this Room Code</span>
                <span className="font-bold font-mono text-2xl">{roomId}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-neutral-50 w-2xl rounded-lg p-6 border border-neutral-300 flex flex-col gap-y-4 shadow-sm h-9/12 ">
            <div
            // ref = {messageref}
              className={`p-4 rounded-lg border border-neutral-300 w-full flex flex-col gap-y-2 overflow-y-auto min-h-11/12 sscroll-smooth
          scrollbar-hide`}
            >
              {messages.map((msg, i) => {
                const me = msg.userId === user;
                return (
                  <MessageCard
                    type={me ? "outgoing" : "incoming"}
                    message={msg.message}
                    key={i}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <>
              <form onSubmit={handleSubmitMessage} className="flex w-full gap-x-3">
                <input
                  type="text"
                  className="flex-1 bg-neutral-50 border text-center border-neutral-300 rounded-lg p-2 text-neutral-600 font-mono placeholder:text-neutral-500 focus:ring-0 focus:ring-offset-0"
                  placeholder="Type Here ..."
                  onChange={handleInputMsgChange}
                  value={msg}
                  minLength={1}
                />
                <button
                  type="submit"
                  // onClick={handleInputMessage}
                  className="text-center font-semibold text-neutral-800 rounded-lg py-2 px-4 bg-neutral-50 border border-neutral-300 hover:bg-neutral-100 active:ring-2 active:ring-neutral-300 cursor-pointer"
                >
                  Send
                </button>
              </form>
            </>
          </div>
        )}
      </div>
    </div>
  );
}
