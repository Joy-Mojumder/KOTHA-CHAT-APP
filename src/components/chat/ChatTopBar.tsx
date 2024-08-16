import { Avatar, AvatarImage } from "../ui/avatar";
import { Info, X } from "lucide-react";
import { useSelectedUser } from "@/hooks/useSelectedUser";
import { usePreferences, useVolume } from "@/hooks/usePreferences";
import useSound from "use-sound";

const ChatTopBar = () => {
  const { selectedUser, setSelectedUser } = useSelectedUser();

  const { volume } = useVolume();
  const [playSoundClick] = useSound("/sounds/mouse-click.mp3", { volume });
  const { soundEnabled } = usePreferences();

  return (
    <div className="w-full h-20 flex p-4 justify-between items-center border-b">
      <div className="flex items-center gap-2">
        <Avatar className=" flex justify-center items-center">
          <AvatarImage
            src={selectedUser?.image || "/user-placeholder.png"}
            alt="user image"
            className="object-cover size-10 rounded-full"
          />
        </Avatar>
        <span className="font-medium">{selectedUser?.name}</span>
      </div>

      <div className="flex gap-2">
        <Info className="text-muted-foreground cursor-pointer hover:text-primary" />
        <X
          className="text-muted-foreground cursor-pointer hover:text-primary"
          onClick={() => {
            setSelectedUser(null);
            soundEnabled && playSoundClick();
          }}
        />
      </div>
    </div>
  );
};

export default ChatTopBar;
