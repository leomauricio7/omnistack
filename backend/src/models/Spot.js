const mongoose = require("mongoose");

const SpotSchema = new mongoose.Schema(
  {
    thumbnail: String,
    company: String,
    price: Number,
    techs: [String],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);

SpotSchema.virtual("thumbnail_url").get(function() {
  return {
    mobile: `http://192.168.100.8:3000/files/${this.thumbnail}`,
    web: `http://localhost:3000/files/${this.thumbnail}`
  };
});

module.exports = mongoose.model("Spot", SpotSchema);
