export enum events {
  "action:session.update" = "update-session",
  "action:room.create" = "create-room",
  "action:room.join" = "join-room",
  "action:room.join#failed" = "join-failed",
  "action:redirect" = "redirect",
  "alert:player.new" = "new-player",
  "query:room.players" = "get-both-players",
}

export enum namespaces {
  "connect" = "/connect",
  "game" = "/game",
}
