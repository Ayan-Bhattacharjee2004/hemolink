const DonationResponse = require("../models/DonationResponse");
const BloodRequest = require("../models/BloodRequest");

const createDonationResponse = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    const response = await DonationResponse.create({
      request: request._id,
      donor: req.user.id,
      requester: request.createdBy,
    });

    const Notification = require("../models/Notification");

await Notification.create({
    user: request.createdBy,
    title: "New Donor Available",
    message: "A donor is available for your blood request.",
    type: "DONOR_RESPONSE",
    relatedRequest: request._id,
});

    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const responses = await DonationResponse.find({
      requester: req.user.id,
      status: "Pending",
    })
      .populate("donor", "fullName bloodType phone")
      .populate("request", "patientName bloodGroup hospital city");

    res.json(responses);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
module.exports = {
  createDonationResponse,
   getMyNotifications,
};