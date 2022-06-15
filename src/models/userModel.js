import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    stageName: {
      type: String,
      default: '',
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "User",
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    savedConcerts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Concerts",
      },
    ],
    purchasedTickets: [
      {
        concert: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Concerts",
        },
        quantity: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("Users", userSchema);
export default UserModel;
