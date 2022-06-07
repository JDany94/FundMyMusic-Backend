import express from "express";
import cors from "cors";
import multer from "multer";
import cloudinary from "cloudinary";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import concertRoutes from "./routes/concert.routes.js";

dotenv.config();
const app = express();
connectDB();

// Habilitando cors
app.use(cors());

// Habilitar express.json
app.use(express.json({ extended: true }));

// Routing
app.use("/api/user", userRoutes);
app.use("/api/concerts", concertRoutes);

app.get("/", (req, res) => {
  res.send("Working!");
});

//Subir imagenes a la nube
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/uploads"),
  filename: (req, file, cb, filename) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/api/files", upload.single("file"), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  await fs.unlink(req.file.path);
  res.send({
    url: result.url,
    publicId: result.public_id,
    size: result.bytes / 1000000,
  });
});

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);

// Socket.io
import { Server } from "socket.io";

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

io.on("connection", (socket) => {
  // Events
  socket.on("updateSale", (concert) => {
    console.log("emit pruebaa", concert);
  });
});
