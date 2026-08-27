import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
    },

    articles: [
      {
        title: String,
        summary: String,
        image: String,
        url: String,
        source: String,
        publishedAt: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DailyNews", newsSchema);