import { useEffect, useRef, useState } from "react";

interface customeWebSocket extends WebSocket {
  roomId?: string | null;
}

export function ChatRoom() {
  const socketRef = useRef<customeWebSocket | null>(null);
  const [loading, setLoading] = useState(false);
  const [roomId, setRoomId] = useState(null);
  function handleCreateRoom() {
    setLoading(true);
    socketRef.current?.send(JSON.stringify({ type: "create", roomId: null }));
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080") as customeWebSocket;
    ws.onopen = () => {
      socketRef.current = ws;
      console.log("Connected");
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.message === "Room Created" && socketRef.current) {
        // socketRef.current.roomId = data.roomId;
        // ws.roomId = data.roomId;
        setRoomId(data.roomId);
        setLoading(false);
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
      <div className="flex w-7xl  mx-auto justify-center h-screen items-center">
        <div className="bg-neutral-50 w-xl rounded-lg p-6 border border-neutral-300 flex flex-col gap-y-4 shadow-sm">
          <button
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
          <div className="flex w-full flex-col gap-y-3">
            <div className="flex w-full gap-x-3">
              <div className="flex-1 bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-neutral-600">
                Enter Room Code
              </div>
              <div className="text-center font-semibold bg-neutral-800 text-neutral-50 rounded-lg py-2 px-4">
                Join Chat
              </div>
            </div>
          </div>
          {roomId && (
            <div className="w-full flex flex-col justify-center items-center bg-neutral-100 rounded-lg py-4">
              <span className="text-neutral-900">Share this RoomId</span>
              <span className="font-bold font-mono text-2xl">{roomId}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
