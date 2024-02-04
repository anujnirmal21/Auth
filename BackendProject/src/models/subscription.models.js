import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    suscriber: {
      type: mongoose.Types.ObjectId, //user who subscribed
      ref: "User",
    },
    channel: {
      type: mongoose.Types.ObjectId, // user whom subscribig
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
