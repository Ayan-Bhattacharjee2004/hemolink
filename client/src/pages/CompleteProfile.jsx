import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

function CompleteProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    dateOfBirth: "",
    gender: "",
    city: "",
    weight: "",
    lastDonationDate: "",
    emergencyContact: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/auth/complete-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      user.profileCompleted = true;

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-purple-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-center">
          Complete Your Profile 🩸
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Help donors find you faster by completing your details.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-4 md:grid-cols-2"
        >
          <div>
            <label className="text-sm font-medium">
              Date of Birth
            </label>

            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border p-3"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Gender
            </label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border p-3"
              required
            >
              <option value="">
                Select Gender
              </option>
              <option value="Male">
                Male
              </option>
              <option value="Female">
                Female
              </option>
              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              City
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Kolkata"
              className="mt-1 w-full rounded-xl border p-3"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Weight (kg)
            </label>

            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="60"
              className="mt-1 w-full rounded-xl border p-3"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Last Donation Date
            </label>

            <input
              type="date"
              name="lastDonationDate"
              value={formData.lastDonationDate}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Emergency Contact
            </label>

            <input
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="mt-1 w-full rounded-xl border p-3"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 mt-4 rounded-xl bg-gradient-to-r from-red-500 to-purple-600 py-3 text-white font-semibold"
          >
            {loading
              ? "Saving..."
              : "Complete Profile"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default CompleteProfile;