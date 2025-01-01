import mongoose, { Schema } from "mongoose";

import IadminModel from "../interface/IadminModel";

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IadminModel>("Admin", adminSchema);
