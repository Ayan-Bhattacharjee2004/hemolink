const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      bloodType,
      password,
    } = req.body;

    const emailExists = await User.findOne({
      email,
    });

    if (emailExists) {
      return res.status(400).json({
        message: "Email is already registered",
      });
    }

    const phoneExists = await User.findOne({
      phone,
    });

    if (phoneExists) {
      return res.status(400).json({
        message: "Phone number is already registered",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      phone,
      bloodType,
      password: hashedPassword,
    });

    try {
      await sendEmail(
        user.email,
        user.fullName
      );
    } catch (err) {
      console.log(
        "Email failed:",
        err.message
      );
    }

    res.status(201).json({
      message:
        "Account created successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Something went wrong. Please try again later.",
    });
  }
};




const loginUser = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileCompleted:
          user.profileCompleted,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const completeProfile = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user.id
    );

    user.dateOfBirth =
      req.body.dateOfBirth;

    user.gender = req.body.gender;

    user.city = req.body.city;

    user.weight = req.body.weight;

    user.lastDonationDate =
      req.body.lastDonationDate;

    user.emergencyContact =
      req.body.emergencyContact;

    user.profileCompleted = true;

    await user.save();

    res.json({
      message:
        "Profile completed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const updateProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.fullName = req.body.fullName;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.city = req.body.city;
        user.gender = req.body.gender;
        user.weight = req.body.weight;
        user.bloodType = req.body.bloodType;
        user.dateOfBirth = req.body.dateOfBirth;
        user.lastDonationDate = req.body.lastDonationDate;

        await user.save();

        res.json(user);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};

const updateAvailability = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        user.available = req.body.available;

        await user.save();

        res.json(user);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

const updateNotificationPreferences = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        user.notificationPrefs = req.body;

        await user.save();

        res.json({
            message: "Notification settings updated"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};


const changePassword = async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        const match = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!match) {

            return res.status(400).json({
                message: "Current password is incorrect"
            });

        }

        user.password = await bcrypt.hash(
            newPassword,
            10
        );

        await user.save();

        res.json({
            message: "Password updated"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

const deleteAccount = async (req, res) => {

    try {

        await User.findByIdAndDelete(req.user.id);

        res.json({
            message: "Account deleted"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};



module.exports = {
    registerUser,
    loginUser,
    completeProfile,
    getProfile,
    updateProfile,
    updateAvailability,
    updateNotificationPreferences,
    changePassword,
    deleteAccount
};