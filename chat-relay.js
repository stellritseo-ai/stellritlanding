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

  socket.on("join-user", (userId) => {
    socket.join(`user:${userId}`);
    console.log(`[Socket] User ${socket.id} joined user:${userId}`);
  });

  socket.on("send-team-message", ({ senderId, recipientId, message }) => {
    io.to(`user:${recipientId}`).emit("receive-team-message", message);
    io.to(`user:${senderId}`).emit("receive-team-message", message);
    console.log(`[Socket] Team message relayed from ${senderId} to ${recipientId}`);
  });

  socket.on("new-email", (data) => {
    io.to("admin-room").emit("receive-new-email", data);
    console.log(`[Socket] New email lead received: ${data?.email?.email}`);
  });

  socket.on("user-online", (userId) => {
    socket.userId = userId;
    const onlineUsers = new Set();
    for (const [_, s] of io.sockets.sockets) {
      if (s.userId) {
        onlineUsers.add(s.userId);
      }
    }
    io.emit("presence-update", Array.from(onlineUsers));
    console.log(`[Presence] User online: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log(`[Socket] Disconnected: ${socket.id}`);
    const onlineUsers = new Set();
    for (const [_, s] of io.sockets.sockets) {
      if (s.userId && s.id !== socket.id) {
        onlineUsers.add(s.userId);
      }
    }
    io.emit("presence-update", Array.from(onlineUsers));
  });
});

httpServer.listen(PORT, () => {
  console.log(`[Relay] StellR IT chat relay listening on port ${PORT}`);
});
