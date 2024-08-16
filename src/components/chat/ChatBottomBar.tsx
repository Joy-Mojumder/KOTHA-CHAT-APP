"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon, Loader, SendHorizontal, ThumbsUp } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "./EmojiPicker";
import { Button } from "../ui/button";
import useSound from "use-sound";
import { usePreferences, useVolume } from "../../hooks/usePreferences";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessageAction } from "@/actions/message.action";
import { useSelectedUser } from "@/hooks/useSelectedUser";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Image from "next/image";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { pusherClient } from "../../lib/pusher";
import { Message } from "@/db/dummy";

const ChatBottomBar = () => {
  const [message, setMessage] = useState("");
  const textAreaRefMy = useRef<HTMLTextAreaElement>(null);

  const { selectedUser } = useSelectedUser();
  const { user: currentUser } = useKindeBrowserClient();

  const { soundEnabled } = usePreferences();
  const { volume } = useVolume();

  const [imgUrl, setImgUrl] = useState("");

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: sendMessageAction,
  });

  const handleSendMessage = () => {
    //if message is not empty, send message
    sendMessage({
      content: message,
      messageType: "text",
      receiverId: selectedUser?.id!,
    });
    //clear message
    setMessage("");

    //focus on text area
    textAreaRefMy.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      setMessage(message + "\n");
    }
  };

  const handleThumbsUp = () => {
    sendMessage({
      content: "👍",
      messageType: "text",
      receiverId: selectedUser?.id!,
    });
  };
  //^ all keyboard sounds

  const [playSoundClick1] = useSound("/sounds/keystroke1.mp3", {
    volume,
  });
  const [playSoundClick2] = useSound("/sounds/keystroke2.mp3", {
    volume,
  });
  const [playSoundClick3] = useSound("/sounds/keystroke3.mp3", {
    volume,
  });

  const [playSoundClick4] = useSound("/sounds/keystroke4.mp3", {
    volume,
  });
  const [playNotification] = useSound("/sounds/notification.mp3", {
    volume,
  });

  //^ play random keyboard sound
  const playRandomSound = () => {
    const randomSound = Math.floor(Math.random() * 4) + 1;
    switch (randomSound) {
      case 1:
        soundEnabled && playSoundClick1();
        break;
      case 2:
        soundEnabled && playSoundClick2();
        break;
      case 3:
        soundEnabled && playSoundClick3();
        break;
      case 4:
        soundEnabled && playSoundClick4();
        break;
    }
  };
  const queryClient = useQueryClient();

  useEffect(() => {
    const channelName = `${currentUser?.id}__${selectedUser?.id}`
      .split("__")
      .sort()
      .join("__");
    const channel = pusherClient.subscribe(channelName);

    const handleNewMessage = (data: { message: Message }) => {
      queryClient.setQueryData(
        ["messages", selectedUser?.id],
        (oldMessages: Message[]) => {
          return [oldMessages, data.message];
        }
      );

      if (soundEnabled && data.message.senderId !== currentUser?.id) {
        playNotification();
      }
    };

    channel.bind("newMessage", handleNewMessage);

    // ! Absolutely important, otherwise the event listener will be added multiple times which means you'll see the incoming new message multiple times
    return () => {
      channel.unbind("newMessage", handleNewMessage);
      pusherClient.unsubscribe(channelName);
    };
  }, [
    currentUser?.id,
    selectedUser?.id,
    queryClient,
    soundEnabled,
    playNotification,
  ]);

  return (
    <div className="w-full flex justify-between items-center gap-2 p-2">
      {!message.trim() && (
        <CldUploadWidget
          signatureEndpoint="/api/sign-cloudinary-params"
          onSuccess={(result, { widget }) => {
            setImgUrl((result.info as CloudinaryUploadWidgetInfo).secure_url);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <ImageIcon
                onClick={() => {
                  open();
                }}
                size={20}
                className="text-muted-foreground cursor-pointer hover:text-primary"
              />
            );
          }}
        </CldUploadWidget>
      )}
      <Dialog open={!!imgUrl}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center relative w-full h-96 mx-auto">
            <Image
              src={imgUrl}
              alt="preview image"
              fill
              className="object-contain"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                sendMessage({
                  content: imgUrl,
                  messageType: "image",
                  receiverId: selectedUser?.id!,
                });
                setImgUrl("");
              }}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AnimatePresence>
        <motion.div
          layout
          key={"textarea"}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.5 },
            layout: { type: "spring", bounce: 0.15 },
          }}
          className="w-full relative"
        >
          <Textarea
            autoComplete="off"
            placeholder="Type a message"
            className="w-full resize-none border rounded-full flex items-center h-9 overflow-hidden bg-background min-h-0 "
            rows={1}
            value={message}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setMessage(e.target.value);
              playRandomSound();
            }}
            ref={textAreaRefMy}
          />
          <div className="absolute bottom-1 right-2">
            <EmojiPicker
              onEmojiChange={(emoji) => {
                setMessage(message + emoji);
                if (textAreaRefMy.current) {
                  textAreaRefMy.current.focus();
                }
              }}
            />
          </div>
        </motion.div>
      </AnimatePresence>
      {message.trim() ? (
        <Button
          className="size-9 shrink-0 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
          size={"icon"}
          variant={"ghost"}
          onClick={handleSendMessage}
        >
          {!isPending ? (
            <SendHorizontal size={20} className="text-muted-foreground" />
          ) : (
            <Loader size={20} className="text-muted-foreground animate-spin" />
          )}
        </Button>
      ) : (
        <Button
          className="size-9 shrink-0 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
          size={"icon"}
          variant={"ghost"}
          disabled={isPending}
          onClick={handleThumbsUp}
        >
          {!isPending ? (
            <ThumbsUp size={20} className="text-muted-foreground" />
          ) : (
            <Loader size={20} className="text-muted-foreground animate-spin" />
          )}
        </Button>
      )}
    </div>
  );
};

export default ChatBottomBar;
