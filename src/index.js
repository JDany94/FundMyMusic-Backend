import express from "express";
import cors from "cors";
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
  res.send("FundMyMusic");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
