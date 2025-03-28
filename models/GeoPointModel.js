const mongoose = require("mongoose")

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'], // Must be 'Point' for GeoJSON
    required: true,
    default: 'Point'
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true,
    validate: {
      validator: (coords) => {
        // Validate longitude (-180 to 180) and latitude (-90 to 90)
        return (
          coords.length === 2 &&
          coords[0] >= -180 && coords[0] <= 180 &&
          coords[1] >= -90 && coords[1] <= 90
        );
      },
      message: `Invalid coordinates. Use [longitude, latitude].`
    }
  }
});

module.exports = pointSchema