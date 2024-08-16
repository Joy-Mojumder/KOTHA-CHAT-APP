"use client";
import { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { cn } from "@/lib/utils";
import SideBar from "../SideBar";
import { useTheme } from "next-themes";
import MessageContainer from "./MessageContainer";
import { useSelectedUser } from "@/hooks/useSelectedUser";
interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  users: User[];
}

const ChatLayout = ({ defaultLayout = [320, 480], users }: ChatLayoutProps) => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { selectedUser } = useSelectedUser();

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full items-stretch bg-background rounded-lg shadow-md"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )};`;
      }}
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={8}
        collapsible={true}
        minSize={isMobile ? 0 : 24}
        maxSize={isMobile ? 8 : 30}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=true;`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=false;`;
        }}
        className={cn(
          isCollapsed && "min-w-[80px] transition-all duration-300 ease-in-out"
        )}
      >
        <SideBar isCollapsed={isCollapsed} users={users} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        {selectedUser ? (
          <MessageContainer />
        ) : (
          <div className="flex justify-center items-center w-full h-full px-10">
            <div className="flex flex-col justify-center items-center gap-4">
              <img
                src="/KOTHA LIGHT LOGO.png"
                alt="kotha app logo"
                className="w-full md:w-2/3 lg:w-1/2 pointer-events-none select-none drop-shadow-lg"
              />
              <p className="text-center text-muted-foreground pointer-events-none select-none">
                Click on chat to view the messages
              </p>
            </div>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ChatLayout;
