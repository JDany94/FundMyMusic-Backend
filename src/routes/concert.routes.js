import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import multerUpload from "../config/multer.js";
import {
  getConcerts,
  getConcert,
  setUserSavedConcerts,
  setpurchasedTickets,
  getArtistConcerts,
  getArtistConcert,
  createArtistConcert,
  editArtistConcert,
  deleteArtistConcert,
  uploadImage,
  editImage,
} from "../controllers/concert.controllers.js";

const router = express.Router();

// Artist
router.get("/artist", checkAuth, getArtistConcerts);
router.post("/artist", checkAuth, createArtistConcert);
router.get("/artist/:id", checkAuth, getArtistConcert);
router.put("/artist/:id", checkAuth, editArtistConcert);
router.delete("/artist/:id", checkAuth, deleteArtistConcert);

// Upload and update images
router.post("/", checkAuth, multerUpload.single("file"), uploadImage);
router.put("/", checkAuth, multerUpload.single("file"), editImage);

// User
router.post("/user-saved-concerts", checkAuth, setUserSavedConcerts);
router.post("/purchased-tickets", checkAuth, setpurchasedTickets);

// All
router.get("/", getConcerts);
router.get("/:id", getConcert);

export default router;
