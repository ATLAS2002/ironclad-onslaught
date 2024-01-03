"use client";

import { useEffect } from "react";
import { Button } from "@repo/ui";

import { useRoomID } from "@/hooks/utils.hooks";
import { useSocket } from "@/hooks/socket.hooks";
import { useEventEmitters } from "@/hooks/events.hooks";
import { events } from "@repo/shared";
import { useRouter } from "next/navigation";

export default function MainPage(): JSX.Element {
  const roomId = useRoomID();
  const { getBothPlayers } = useEventEmitters();
  const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    console.log("mounted");
    socket?.on(events["event:game.end"], () => {
      console.log("Opponent has left");
      router.replace("/");
    });

    return () => {
      console.log("unmounted");
      socket?.emit(events["action:room.leave"], (player: string) => {
        console.log(`${player} has left the room`);
      });
      socket?.removeAllListeners();
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
