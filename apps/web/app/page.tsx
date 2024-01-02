"use client";
import { useRouter } from "next/navigation";

import { Button } from "@repo/ui";
import { events } from "@repo/shared/constants";

import { useSocket } from "@/hooks/socket.hooks";
import { useEventEmitters } from "@/hooks/events.hooks";

export default function HomePage(): JSX.Element {
  const { createRoom, joinRoom, changeName } = useEventEmitters();
  const { socket, session } = useSocket();
  const router = useRouter();
  socket?.on(events["action:redirect"], (roomId: string) => {
    router.push(`/${roomId}`);
  });
  return (
    <main className="flex h-screen w-full flex-col items-center justify-start">
      <h1 className="my-40 font-mono text-5xl font-black text-slate-300">
        Start the Game
      </h1>
      <div className="flex gap-4">
        <Button
          onClick={() => {
            console.log(session);
            createRoom();
          }}
        >
          Create room
        </Button>
        <Button
          onClick={() => {
            const roomId = prompt("Enter the room id");
            joinRoom(roomId);
          }}
        >
          Join room
        </Button>
        <Button
          onClick={() => {
            const username = prompt("Enter your name");
            changeName(username);
          }}
        >
          Change name
        </Button>
      </div>
    </main>
  );
}
