import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket) {
    res.status(500).json({ error: "Socket unavailable" });
    return;
  }

  // Check if Socket.IO is already initialized
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as NetServer;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
    console.log("[SOCKET_IO] Initialized Socket.IO server");
  } else {
    console.log("[SOCKET_IO] Socket.IO server already initialized");
  }

  res.end();
};

export default ioHandler;