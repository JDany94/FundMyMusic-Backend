import dotenv from "dotenv";
import cloudinary from "cloudinary";
import ConcertModel from "../models/concertModel.js";
dotenv.config();



const getConcerts = async (req, res) => {
  const concerts = await ConcertModel.find();
  res.json(concerts);
};

const getConcert = async (req, res) => {
  const { id } = req.params;
  try {
    const concert = await ConcertModel.findById(id);
    if (!concert) {
      const error = new Error("Concert does not exist");
      return res.status(404).json({ msg: error.message });
    }
    res.json(concert);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

const getUserSavedConcerts = async (req, res) => {
  //falta
  console.log("falta");
};

const getArtistConcerts = async (req, res) => {
  const concerts = await ConcertModel.find()
    .where("artist")
    .equals(req.user.id);
  res.json(concerts);
};

const getArtistConcert = async (req, res) => {
  const { id } = req.params;
  try {
    const concert = await ConcertModel.findById(id);
    if (!concert) {
      const error = new Error("Concert does not exist");
      return res.status(404).json({ msg: error.message });
    }
    if (concert.artist.toString() !== req.user.id.toString()) {
      const error = new Error("Permission denied");
      return res.status(401).json({ msg: error.message });
    }
    res.json(concert);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

const createArtistConcert = async (req, res) => {
  const concert = new ConcertModel(req.body);
  concert.artist = req.user.id;
  concert.available = concert.capacity;
  try {
    const concertSaved = await concert.save();
    res.json(concertSaved);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

const editArtistConcert = async (req, res) => {
  const { id } = req.params;
  try {
    const findConcert = await ConcertModel.findById(id);
    if (!findConcert) {
      const error = new Error("Concert does not exist");
      return res.status(404).json({ msg: error.message });
    }
    if (findConcert.artist.toString() !== req.user.id.toString()) {
      const error = new Error("Permission denied");
      return res.status(401).json({ msg: error.message });
    }

    const {
      title,
      concertFlyer,
      genre,
      place,
      description,
      capacity,
      minimumSales,
      gift,
      available,
      price,
      date,
    } = req.body;
    const newConcert = {};

    newConcert.title = title;
    newConcert.concertFlyer = concertFlyer;
    newConcert.genre = genre;
    newConcert.place = place;
    newConcert.description = description;
    newConcert.capacity = capacity;
    newConcert.minimumSales = minimumSales;
    newConcert.gift = gift;
    newConcert.available = available;
    newConcert.price = price;
    newConcert.date = date;

    const concert = await ConcertModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newConcert },
      { new: true }
    );
    res.json(concert);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

const deleteArtistConcert = async (req, res) => {
  const { id } = req.params;
  try {
    const concert = await ConcertModel.findById(id);
    if (!concert) {
      const error = new Error("Concert does not exist");
      return res.status(404).json({ msg: error.message });
    }
    if (concert.artist.toString() !== req.user.id.toString()) {
      const error = new Error("Permission denied");
      return res.status(401).json({ msg: error.message });
    }
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    await cloudinary.v2.uploader.destroy(concert.FlyerPublicId);
    await concert.deleteOne();
    res.json({ msg: "Concierto eliminado" });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

export {
  getConcerts,
  getConcert,
  getUserSavedConcerts,
  getArtistConcerts,
  getArtistConcert,
  createArtistConcert,
  editArtistConcert,
  deleteArtistConcert,
};
