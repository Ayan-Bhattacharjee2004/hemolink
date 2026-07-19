const BloodRequest = require("../models/BloodRequest");

const createRequest = async (req, res) => {
  try {
    const request = await BloodRequest.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({ status: "Active" }).sort({
      emergency: -1,
      createdAt: -1,
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getMyRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      createdBy: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!request) {
      return res.status(404).json({
        message: "Blood request not found",
      });
    }

    await request.deleteOne();

    res.json({
      message: "Blood request deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
const getBloodDemand = async (req, res) => {
  try {
    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    const demand = await Promise.all(
      bloodTypes.map(async (type) => {
        const count = await BloodRequest.countDocuments({
          bloodGroup: type,
          status: "Active",
        });

        let status = "Stable";

        if (count >= 5) status = "Critical";
        else if (count >= 2) status = "Low";

        return {
          type,
          requests: count,
          status,
        };
      })
    );

    res.json(demand);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createRequest,
  getRequests,
   getMyRequests,
   deleteRequest,
   getBloodDemand,
};