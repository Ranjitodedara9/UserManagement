import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../redux/Reducers/reducer";
import { useNavigate } from "react-router";
// Email validation regex (basic format)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone number validation regex (US format, 10 digits)
const phoneRegex = /^\d{10}$/;

const Ragistration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // New phone field
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, seterror] = useState(null);
  const dispatch = useDispatch();
  var { isLoading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const handleRegister = (e) => {
    e.preventDefault();

    // Validate password match
    if (password !== confirmPassword) {
      seterror("Passwords must match.");
      return;
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      seterror("Please enter a valid email address.");
      return;
    }

    // Validate phone number format (optional)
    if (phone && !phoneRegex.test(phone)) {
      seterror("Please enter a valid phone number (10 digits).");
      return;
    }

    seterror(null);

    dispatch(registerUser({ name, email, phone, password }))
      .unwrap()
      .then((data) => {
        console.log(data);
        navigate("/profile", { state: { token: data.token } });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold  text-center mb-6">Register</h2>
        {error && <span className="text-red-600 text-lg p-2">{error}</span>}
        <form
          className="space-y-4"
          onSubmit={handleRegister}>
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Phone "
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Display error message */}
          {errors && (
            <div className="text-red-600 text-sm font-medium mt-2">
              {errors}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
          <a
            href=""
            onClick={() => navigate("/login")}
            className="flex underline text-lg font-semibold justify-center text-blue-900">
            You already have a account..?
          </a>
        </form>
      </div>
    </div>
  );
};

export default Ragistration;
