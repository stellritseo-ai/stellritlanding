import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3001;

const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("StellR IT Chat Relay is running.");
});

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  socket.on("join-room", (sessionId) => {
    socket.join(`room:${sessionId}`);
    console.log(`[Socket] ${socket.id} joined room:${sessionId}`);
  });

  socket.on("join-admin", () => {
    socket.join("admin-room");
    console.log(`[Socket] ${socket.id} joined admin-room`);
  });

  socket.on("new-message", ({ sessionId, message }) => {
    // Relay to the session room (visitor sees admin reply, admin sees visitor msg)
    socket.to(`room:${sessionId}`).emit("receive-message", message);
    // Also notify admin room of new visitor messages
    if (message.sender === "visitor") {
      socket.to("admin-room").emit("visitor-message", { sessionId, message });
    }
  });

  socket.on("disconnect", () => {
    console.log(`[Socket] Disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`[Relay] StellR IT chat relay listening on port ${PORT}`);
});
