import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    try {
      const res = await axios.get("https://food-delivery-app-server-six.vercel.app/api/messages/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error(
        "Fetch admin messages failed",
        err.response || err.message || err
      );
      alert(err.response?.data?.message || "Failed to load messages");
    }
  };

  useEffect(() => {
    fetchMessages();

    const handler = (e) => {
      // refresh when a new message arrives via socket
      fetchMessages();
    };

    window.addEventListener("newMessage", handler);
    return () => window.removeEventListener("newMessage", handler);
  }, []);

  const sendReply = async (id) => {
    try {
      await axios.put(
        `hhttps://food-delivery-app-server-six.vercel.app/api/messages/reply/${id}`,
        { reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReply("");
      fetchMessages();
    } catch (err) {
      console.error("Reply failed", err.response || err.message || err);
      alert(err.response?.data?.message || "Failed to send reply");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#1a120b] text-white">
      <h2 className="text-3xl font-bold text-amber-400 mb-6">Admin Messages</h2>

      {messages.length === 0 ? (
        <p>No messages</p>
      ) : (
        messages.map((msg) => (
          <div key={msg._id} className="bg-[#3a2b2b]/60 p-6 rounded-xl mb-6">
            <p className="text-amber-300 font-bold">{msg.userEmail}</p>

            <p className="font-semibold mt-2">{msg.subject}</p>
            <p className="mt-1">{msg.message}</p>

            {msg.reply ? (
              <p className="text-green-400 mt-3">Replied: {msg.reply}</p>
            ) : (
              <>
                <textarea
                  placeholder="Write reply..."
                  className="w-full mt-4 p-3 rounded bg-[#2a1e14]"
                  rows="3"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button
                  onClick={() => sendReply(msg._id)}
                  className="mt-3 bg-green-500 text-black px-5 py-2 rounded font-bold"
                >
                  Send Reply
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminMessages;
