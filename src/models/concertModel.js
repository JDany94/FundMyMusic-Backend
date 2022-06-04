import mongoose from "mongoose";

const concertSchema = mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    audience: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    title: {
      type: String,
      required: true,
      trim: true,
    },
    concertFlyer: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    place: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now(),
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      trim: true,
    },
    minimumSales: {
      type: Number,
      required: true,
      trim: true,
    },
    gift: {
      type: String,
      default: "",
      trim: true,
    },
    available: {
      type: Number,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "Fecha Abierta",
      trim: true,
    },
    soldOut: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ConcertModel = mongoose.model("Concerts", concertSchema);
export default ConcertModel;
