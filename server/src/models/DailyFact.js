import mongoose from "mongoose";

const dailyFactSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
    },

    fact: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "DailyFact",
  dailyFactSchema
);