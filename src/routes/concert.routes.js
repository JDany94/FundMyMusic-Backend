import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {
  getConcerts,
  getConcert,
  getUserSavedConcerts,
  getArtistConcerts,
  getArtistConcert,
  createArtistConcert,
  editArtistConcert,
  deleteArtistConcert,
} from "../controllers/concert.controllers.js";

const router = express.Router();

// Artist
router.get("/artist", checkAuth, getArtistConcerts);
router.post("/artist", checkAuth, createArtistConcert);
router.get("/artist/:id", checkAuth, getArtistConcert);
router.put("/artist/:id", checkAuth, editArtistConcert);
router.delete("/artist/:id", checkAuth, deleteArtistConcert);

// User
router.get("/userSaved", checkAuth, getUserSavedConcerts); //falta

// All
router.get("/", checkAuth, getConcerts);
router.get("/:id", checkAuth, getConcert);

export default router;
