"use client";

import { useEffect } from "react";
import { Button } from "@repo/ui";

import { useRoomID } from "@/hooks/utils.hooks";
import { useSocket } from "@/hooks/socket.hooks";
import { useEventEmitters } from "@/hooks/events.hooks";

export default function MainPage(): JSX.Element {
  const roomId = useRoomID();
  const { getBothPlayers } = useEventEmitters();
  const { socket } = useSocket();
  useEffect(() => {
    console.log("mounted");
    return () => {
      socket?.emit("exit-room");
    };
  }, []);
  return (
    <main className="flex h-screen w-full flex-col items-center justify-start p-20">
      <Button
        onClick={() => {
          console.log(roomId);
          getBothPlayers(roomId);
        }}
      >
        Check Name
      </Button>
    </main>
  );
}
