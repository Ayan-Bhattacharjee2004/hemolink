const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bloodRequestRoutes = require("./routes/bloodRequestRoutes");
const donationResponseRoutes = require("./routes/donationResponseRoutes");


const connectDB =
  require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/donation-response", donationResponseRoutes);
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

app.get("/", (req, res) => {
  res.send("HemoLink API Running");
});

app.listen(
  process.env.PORT,
  () => {
    console.log(
      `Server running on ${process.env.PORT}`
    );
  }
);