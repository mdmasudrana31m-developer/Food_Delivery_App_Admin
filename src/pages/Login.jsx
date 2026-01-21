import axios from "axios";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";

import { toast } from "react-toastify";
import { iconClass, inputBase } from "../assets/dummy";

const Login = ({ setToken }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/admin",
        { email, password },
      );

      if (response.data.token) {
        // persist token immediately to avoid timing issues for children
        try {
          localStorage.setItem("token", response.data.token);
        } catch {
          // ignore storage errors
        }
        setToken(response.data.token);
        toast.success("Login Successfuly!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      // Prefer showing the server-provided message when available
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || error.message || "Login failed");
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-amber-800 to-amber-600 min-h-screen">
      <div className="bg-gradient-to-br from-[#2D1B0E] to-[#4a372a] rounded-xl p-6 w-full max-w-[420px] relative border-4 border-amber-700/30 shadow-[0_0_30px] shadow-amber-500/30 ">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-4 text-center">
          Admin Login Panel
        </h2>
        <div className="space-y-6 relative">
          <form onSubmit={onSubmitHandler} className="space-y-6">
            <div className="relative ">
              <FaUser className={`${iconClass}  left-3 `} />
              <input
                type="text"
                name="username"
                value={email}
                placeholder="Email or username"
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputBase}  pl-10 pr-4 py-3`}
                required
              />
            </div>

            <div className="relative">
              <FaLock className={iconClass} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputBase}  p-10  py-3`}
                required
              />
              <button
                onClick={togglePassword}
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#2d1b0e] font-bold rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform cursor-pointer"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
