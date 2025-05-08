import { Server as NetServer } from "http";
import { Socket as NetSocket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Member, Profile, Server } from "@prisma/client"

export type ServerWithMembersWithProfiles = Server & {
    members: (Member & {profile: Profile})[]
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: NetSocket & {
      server: NetServer & {
        io?: SocketIOServer;
      };
    };
  };