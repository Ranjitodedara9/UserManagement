import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userdata, setuserdata] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });
  const location = useLocation();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${location.state?.token}`,
          },
        }
      );
      setProfile(response.data);
      setuserdata(response.data.user);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch profile. Please try again.");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/login", { state: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    console.log(location.state);
    try {
      const response = await fetch("http://localhost:4000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${location.state?.token}`,
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("update : ", data);
      setProfile(data);
      setuserdata(data.user);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center bg-slate-800 text-white p-3 rounded-md mb-6">
          User Profile
        </h2>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleUpdateProfile}
                className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600">
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto bg-gray-900 rounded-full flex items-center justify-center text-3xl font-semibold text-white">
                {userdata.name?.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-semibold mt-4">{userdata.name}</h3>
              <p className="text-gray-600">{userdata.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Joined On:</span>
                <span className="font-medium">
                  {new Date(userdata.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => {
                  setEditData({ name: userdata.name, email: userdata.email });
                  setIsEditing(true);
                }}
                className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
