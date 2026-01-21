import React, { useState, useEffect } from "react";
import { navLinks, styles } from "../assets/dummyadmin";
import { GiChefToque } from "react-icons/gi";
import { FiX, FiMenu, FiLogOut } from "react-icons/fi";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { LuMessageSquareMore } from "react-icons/lu";

const Navber = ({ token, setToken }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchUnread = async () => {
      try {
        if (!token) return;
        const res = await axios.get("https://food-delivery-app-server-six.vercel.app/api/messages/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        const msgs = Array.isArray(res.data) ? res.data : [];
        const unread = msgs.filter((m) => m.status === "unread").length;
        setUnreadCount(unread);
      } catch (err) {
        console.debug(
          "Failed to fetch unread messages",
          err?.response?.data || err.message || err
        );
      }
    };

    fetchUnread();
    const id = setInterval(fetchUnread, 10000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [token]);
  return (
    <nav className={styles.navWrapper}>
      <div className={styles.navContainer}>
        <div className={styles.logoSection}>
          <GiChefToque className={styles.logoIcon} />
          <span className={styles.logoText}>Admin</span>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={styles.menuButton}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={styles.desktopMenu}>
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) =>
                `${styles.navLinkBase} ${
                  isActive ? styles.navLinkActive : styles.navLinkInactive
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}

          <div className="flex items-center  ">
            <NavLink
              to="/message"
              className={({ isActive }) =>
                isActive
                  ? "p-2  text-amber-100 rounded-xl transition-all relative border-2  border-amber-500 group "
                  : "p-2  text-amber-100 rounded-xl transition-all relative border-2 border-amber-900/30 hover:border-amber-500 group hover:bg-amber-900/20"
              }
            >
              <LuMessageSquareMore className="text-base md:text-lg lg:text-2xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("token");
            setToken("");
          }}
          className="hidden  lg:flex  items-center space-x-2 gap-1  px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all hover:bg-red-600 hover:text-white border-red-600 text-red-600 cursor-pointer"
        >
          <FiLogOut className="text-base md:text-lg lg:text-lg" />
          Logout
        </button>
      </div>

      {menuOpen && (
        <>
          <div className="px-5">
            <div className={`${styles.mobileMenu}`}>
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={({ isActive }) =>
                    `${styles.navLinkBase} ${
                      isActive ? styles.navLinkActive : styles.navLinkInactive
                    }`
                  }
                >
                  {link.icon} <span>{link.name}</span>
                </NavLink>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("token");
                setToken("");
              }}
              className="text-center space-x-2 w-full py-3 rounded-xl border-2 text-sm font-bold transition-all bg-red-600  border-orange-600 mx-auto"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navber;
