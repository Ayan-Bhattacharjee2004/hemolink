const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },

    bloodGroup: {
      type: String,
      required: true,
    },

    hospital: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    units: {
      type: Number,
      required: true,
    },

    requiredDate: {
      type: Date,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    notes: String,

    emergency: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);