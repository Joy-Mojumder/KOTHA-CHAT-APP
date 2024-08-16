import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useSelectedUser } from "@/hooks/useSelectedUser";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "@tanstack/react-query";
import { getMessagesAction } from "@/actions/message.action";
import { useEffect, useRef } from "react";
import MessageSkeleton from "../skeleton/MessageSkeleton";
const MessageList = () => {
  const { selectedUser } = useSelectedUser();
  const { user: currentUser, isLoading: isLoadingUser } =
    useKindeBrowserClient();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading: isMessagesLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: async () =>
      await getMessagesAction(selectedUser?.id!, currentUser?.id!),

    enabled: !!selectedUser && !!currentUser && !isLoadingUser,
  });

  //^scroll to bottom on new message or on load
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div
      className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      ref={messageContainerRef}
    >
      <AnimatePresence>
        {!isMessagesLoading &&
          messages?.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 20, x: 0 }}
              transition={{
                opacity: { duration: 0.2 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                message.senderId === currentUser?.id
                  ? "items-end"
                  : "items-start"
              )}
            >
              <div className="flex items-center gap-3">
                {message.senderId === selectedUser?.id && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      src={selectedUser.image}
                      alt="user image"
                      className="border-2 border-white rounded-full"
                    />
                  </Avatar>
                )}
                {message.messageType === "text" ? (
                  <span className="bg-accent p-3 rounded-md max-w-xs">
                    {message.content}
                  </span>
                ) : (
                  <img
                    src={message.content}
                    alt="Message image"
                    className="border p-2 rounded h-40 md:h-52 object-cover"
                  />
                )}
                {message.senderId === currentUser?.id && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      src={currentUser?.picture!}
                      alt="user image"
                      className="border-2 border-white rounded-full"
                    />
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))}

        {isMessagesLoading && (
          <>
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessageList;
