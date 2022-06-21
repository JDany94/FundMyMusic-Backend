import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

import userRoutes from "./routes/user.routes.js";
import concertRoutes from "./routes/concert.routes.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Connections
connectDB();
connectCloudinary();

// Enabling cors
app.use(cors());

// Enabling express.json
app.use(express.json({ extended: true }));

// Routing
app.use("/api/user", userRoutes);
app.use("/api/concerts", concertRoutes);
app.use("/api/files", concertRoutes);

// Home
app.get("/", (req, res) => {
  res.sendFile(
    path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../public/index.html"
    )
  );
});

// Turn on the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

// TODO: Configurar Socket.io
// Socket.io
//import { Server } from "socket.io";
//const io = new Server(server, {
//  pingTimeout: 60000,
//  cors: {
//    origin: process.env.FRONTEND_URL,
//  },
//});
//io.on("connection", (socket) => {
//  // Events
//});
