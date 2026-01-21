import React, { useEffect, useState } from "react";
import Navber from "./components/Navber";
import { Route, Routes } from "react-router-dom";
import AddItems from "./components/AddItems";
import List from "./components/List";
import Order from "./components/Order";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import { io as ioClient } from "socket.io-client";
import AdminMessages from "./pages/AdminMessages";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  // real-time socket for admin: listen for new messages and dispatch event
  useEffect(() => {
    if (!token) return;
    const socket = ioClient("http://localhost:8000");
    socket.emit("register", { admin: true });
    socket.on("newMessage", (msg) => {
      try {
        window.dispatchEvent(new CustomEvent("newMessage", { detail: msg }));
      } catch (e) {
        // ignore
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Make ToastContainer available on all pages (including Login) */}
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navber token={token} setToken={setToken} />
          <Routes>
            <Route path="/" element={<AddItems />} />
            <Route path="/list" element={<List />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/message" element={<AdminMessages />} />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
