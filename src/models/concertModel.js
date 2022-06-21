import mongoose from "mongoose";

const concertSchema = mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    FlyerURL: {
      type: String,
      required: true,
    },
    FlyerPublicId: {
      type: String,
      required: true,
    },
    FlyerSize: {
      type: Number,
      required: true,
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
      required: true,
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
    sold: {
      type: Number,
      default: 0,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "Open",
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
