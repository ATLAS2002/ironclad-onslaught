export enum events {
  "action:session.update" = "update-session",
  "action:room.create" = "create-room",
  "action:room.join" = "join-room",
  "action:room.join#failed" = "join-failed",
  "action:room.leave" = "leave-room",
  "event:player.new" = "new-player",
  "event:game.start" = "game-start",
  "event:game.end" = "game-end",
  "query:room.players" = "get-both-players",
}

export enum namespaces {
  "connect" = "/connect",
  "game" = "/game",
}
