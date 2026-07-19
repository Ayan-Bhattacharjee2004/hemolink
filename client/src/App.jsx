import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SearchDonors from "./pages/SearchDonors";
import BloodRequests from "./pages/BloodRequests";
import NotFound from "./pages/NotFound";
import CompleteProfile from "./pages/CompleteProfile";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/search" element={<SearchDonors />} />
        <Route path="/requests" element={<BloodRequests />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/complete-profile" element={<CompleteProfile />}/>
        <Route path="/profile" element={<Profile />} />
        <Route
  path="/notifications"
  element={<Notifications />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;