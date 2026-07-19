const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    bloodType: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    weight: {
      type: Number,
      default: null,
    },

    lastDonationDate: {
      type: Date,
      default: null,
    },

    emergencyContact: {
      type: String,
      default: "",
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

available: {
    type: Boolean,
    default: true,
},

notificationPrefs: {
    emailAlerts: {
        type: Boolean,
        default: true,
    },
    smsAlerts: {
        type: Boolean,
        default: true,
    },
    nearbyRequests: {
        type: Boolean,
        default: true,
    },
    donationReminders: {
        type: Boolean,
        default: true,
    },
},

donations: {
    type: Number,
    default: 0,
},

livesHelped: {
    type: Number,
    default: 0,
},

responses: {
    type: Number,
    default: 0,
},


  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);