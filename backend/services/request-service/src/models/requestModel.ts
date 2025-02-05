import mongoose, { Schema } from "mongoose";

import IrequestModel from "../interface/IrequestModel";

const requestSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    reward_amount: {
      type: Number,
      required: true,
    },
    product_category: {
      type: String,
      required: true,
    },
    last_seen: {
      type: String,
      required: true,
    },
    expiration_validity: {
      type: String,
      required: true,
    },
    missing_while: {
      type: String,
      required: true
    },
    missing_place: {
      type: String,
    },
    mode_of_travel: {
      type: String,
    },
    missing_route: {
      type: Array,
    },
    missing_date: {
      type: Date,
      required: true,
    },
    expiration_date: {
      type: Date,
      required: true,
    },
    product_images: {
      type: Array,
    },
    additional_information: {
      type: String,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IrequestModel>("Request", requestSchema);
