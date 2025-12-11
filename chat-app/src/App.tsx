import { Toaster } from "sonner";
import { ChatRoom } from "./components/chatRoom";

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors={true} />
      <ChatRoom />
    </>
  );
}

export default App;
