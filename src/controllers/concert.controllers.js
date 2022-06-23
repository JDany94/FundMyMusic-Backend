import cloudinary from "cloudinary";
import fs from "fs-extra";

import ConcertModel from "../models/concertModel.js";
import UserModel from "../models/userModel.js";

import dotenv from "dotenv";
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

const setUserSavedConcerts = async (req, res) => {
  const user = req.user;
  try {
    const findUser = await UserModel.findById(user._id);
    if (!findUser) {
      const error = new Error("El usuario no existe");
      return res.status(404).json({ msg: error.message });
    }
    const { savedConcerts } = req.body;
    const update = {};
    update.savedConcerts = savedConcerts;
    const newUser = await UserModel.findByIdAndUpdate(
      { _id: user._id },
      { $set: update },
      { new: true }
    ).select("-password -confirmed -token -createdAt -updatedAt -__v");
    res.json(newUser);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

const setpurchasedTickets = async (req, res) => {
  let user = req.user;
  try {
    const findUser = await UserModel.findById(user._id);
    if (!findUser) {
      const error = new Error("El usuario no existe");
      return res.status(404).json({ msg: error.message });
    }
    const { concert, quantity } = req.body;
    const newConcert = {
      concert,
      quantity,
    };
    const price = quantity * concert.price;
    if (user.balance >= price) {
      // Si hay suficiente saldo se busca el concierto y se actualiza las ventas
      let concertDB = await ConcertModel.findById(concert._id);
      if (concertDB.capacity - concertDB.sold >= quantity) {
        // Si hay tickets suficientes
        concertDB.sold += quantity;
        if (concertDB.sold >= concertDB.minimumSales) {
          concertDB.status = "Closed";
        }
        if (concertDB.sold === concertDB.capacity) {
          concertDB.soldOut = true;
        }
        // Se actualiza el concierto
        await ConcertModel.findByIdAndUpdate(
          { _id: concertDB._id },
          { $set: concertDB },
          { new: true }
        );
        user.balance -= price;
        let findConcert = false;
        for (let i = 0; i < user.purchasedTickets.length; i++) {
          if (
            JSON.stringify(user.purchasedTickets[i].concert) ===
            JSON.stringify(concert._id)
          ) {
            user.purchasedTickets[i].quantity += quantity;
            findConcert = true;
          }
        }
        if (!findConcert) {
          user.purchasedTickets.push(newConcert);
        }
        const update = {};
        update.balance = user.balance;
        update.purchasedTickets = user.purchasedTickets;
        // Se agregan las entradas y resta el saldo al usuario
        const newUser = await UserModel.findByIdAndUpdate(
          { _id: user._id },
          { $set: update },
          { new: true }
        ).select("-password -confirmed -token -createdAt -updatedAt -__v");
        res.json(newUser);
      } else {
        res.status(404).json({ msg: "Entradas agotadas" });
      }
    } else {
      res.status(404).json({ msg: "Saldo Insuficiente" });
    }
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
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
      price,
      date,
      FlyerURL,
      FlyerPublicId,
      FlyerSize,
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
    newConcert.price = price;
    newConcert.date = date;
    newConcert.FlyerURL = FlyerURL;
    newConcert.FlyerPublicId = FlyerPublicId;
    newConcert.FlyerSize = FlyerSize;

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
    await cloudinary.v2.uploader.destroy(concert.FlyerPublicId);
    await concert.deleteOne();
    res.json({ msg: "Concierto eliminado" });
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

const uploadImage = async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  await fs.unlink(req.file.path);
  res.send({
    url: result.url.replace(/http/g, "https"),
    publicId: result.public_id,
    size: result.bytes / 1000000,
  });
};

const editImage = async (req, res) => {
  await cloudinary.v2.uploader.destroy(req.body.FlyerPublicId);
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  await fs.unlink(req.file.path);
  res.send({
    url: result.url.replace(/http/g, "https"),
    publicId: result.public_id,
    size: result.bytes / 1000000,
  });
};

const uploadAPK = async (req, res) => {
  res.send(req.file.filename);
};

export {
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
  uploadAPK,
};
