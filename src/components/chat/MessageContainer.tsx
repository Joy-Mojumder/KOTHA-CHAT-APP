import { AnimatePresence } from "framer-motion";
import ChatBottomBar from "./ChatBottomBar";
import ChatTopBar from "./ChatTopBar";
import MessageList from "./MessageList";

const MessageContainer = () => {
  return (
    <section className="flex flex-col justify-between w-full h-full">
      <ChatTopBar />
      <div className="flex flex-col overflow-x-hidden overflow-y-auto w-full h-full">
        <MessageList />
        <ChatBottomBar />
      </div>
    </section>
  );
};

export default MessageContainer;
