import React, { useEffect, useState } from "react";
import {
  iconMap,
  layoutClasses,
  paymentMethodDetails,
  statusStyles,
  tableClasses,
} from "../assets/dummyadmin";
import { TbCurrencyTaka } from "react-icons/tb";
import { MdOutlinePhone } from "react-icons/md";
import { CiMail } from "react-icons/ci";
import axios from "axios";
import { FiBox, FiUser } from "react-icons/fi";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://food-delivery-app-server-six.vercel.app/api/orders/getall",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const formatted = response.data.map((order) => ({
          ...order,
          // normalize address: if shippingAddress is an object, build a readable string
          address: (() => {
            const raw = order.address ?? order.shippingAddress ?? "";
            if (!raw) return "";
            if (typeof raw === "string") return raw;
            const parts = [];
            const name = `${raw.firstName || ""} ${raw.lastName || ""}`.trim();
            if (name) parts.push(name);
            if (raw.street) parts.push(raw.street);
            if (raw.city) parts.push(raw.city);
            if (raw.state) parts.push(raw.state);
            if (raw.zipcode) parts.push(raw.zipcode);
            if (raw.zipCode) parts.push(raw.zipCode);
            if (raw.country) parts.push(raw.country);
            return parts.join(", ");
          })(),
          city:
            order.city ??
            order.shippingAddress?.city ??
            order.shippingAddress?.zipcode ??
            "",
          zipCode:
            order.zipCode ??
            order.shippingAddress?.zipcode ??
            order.shippingAddress?.zipCode ??
            "",
          phone: order.phone ?? "",
          items:
            order.items?.map((e) => ({
              _id: e._id,
              item: e.item,
              quantity: e.quantity,
            })) || [],
          createdAt: new Date(order.createdAt).toLocaleString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setOrders(formatted);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `https://food-delivery-app-server-six.vercel.app/api/orders/getall/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      setOrders(
        orders.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  if (loading)
    return (
      <div className={layoutClasses.page + " flex items-center justify-center"}>
        <div className="text-amber-400 text-xl">Loading orders...</div>
      </div>
    );

  if (error) {
    return (
      <div className={layoutClasses.page + " flex items-center justify-center"}>
        <div className="text-red-400 text-xl"> {error}</div>
      </div>
    );
  }

  return (
    <div className={layoutClasses.page}>
      <div className="mx-auto max-w-7xl">
        <div className={layoutClasses.card}>
          <h2 className={layoutClasses.heading}>Order Management</h2>
          <div className={tableClasses.wrapper}>
            <table className={tableClasses.table}>
              <thead className={tableClasses.headerRow}>
                <tr>
                  {[
                    "Order ID",
                    "Customer",
                    "Address",
                    "Items",
                    "Total Items",
                    "Price",
                    "Payment",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className={
                        tableClasses.headerCell +
                        (h === "Total Items" ? " text-center" : "")
                      }
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const totalItems = order.items.reduce(
                    (s, i) => s + i.quantity,
                    0,
                  );
                  const totalPrice =
                    order.total ??
                    order.items.reduce(
                      (s, i) =>
                        s +
                        (Number(i.item?.price) || 0) *
                          (Number(i.quantity) || 0),
                      0,
                    );

                  const payMethod =
                    paymentMethodDetails[order.paymentMethod?.toLowerCase()] ||
                    paymentMethodDetails.default;

                  const payStatusStyle =
                    statusStyles[order.paymentStatus] ||
                    statusStyles.processing;

                  const stat =
                    statusStyles[order.status] || statusStyles.processing;

                  return (
                    <tr key={order._id} className={tableClasses.row}>
                      <td
                        className={
                          tableClasses.cellBase +
                          " text-sm text-amber-100 font-mono"
                        }
                      >
                        #{order._id?.slice(-8)}
                      </td>
                      <td className={tableClasses.cellBase}>
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-amber-100 flex items-center gap-1">
                              <FiUser />

                              {order.user?.name ||
                                `${order.firstName || ""} ${
                                  order.lastName || ""
                                }`}
                            </p>

                            <p className="text-sm text-amber-400/60 flex items-center gap-1">
                              <MdOutlinePhone />
                              {order.user?.phone || order.phone}
                            </p>
                            <p className="text-sm text-amber-400/60 flex items-center gap-1">
                              <CiMail />
                              {order.user?.email || order.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className={tableClasses.cellBase}>
                        <div className="text-amber-100/80 text-sm max-w-[200px]">
                          {order.address}, {order.city} * {order.zipCode}
                        </div>
                      </td>

                      <td className={tableClasses.cellBase}>
                        <div className="space-y-1 max-h-52 overflow-auto">
                          {order.items.map((itm, idx) => {
                            const product = itm?.item || itm || {};
                            const imageSrc = product?.imageUrl
                              ? `https://food-delivery-app-server-six.vercel.app${product.imageUrl}`
                              : "/placeholder.svg";
                            const name = product?.name || "Unknown product";
                            return (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-2 rounded-lg"
                              >
                                <img
                                  src={imageSrc}
                                  alt={name}
                                  className="w-10 h-10 object-cover rounded-lg"
                                />

                                <div className="flex-1">
                                  <span className="text-amber-100/80 text-sm block truncate">
                                    {name}
                                  </span>

                                  <div className="flex items-center gap-2 text-xs text-amber-400/60">
                                    <span>
                                      {(Number(product.price) || 0).toFixed(2)}
                                    </span>
                                    <span>'</span>
                                    <span>{Number(itm.quantity) || 0}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      <td className={tableClasses.cellBase + "text-center"}>
                        <div className="flex items-center justify-center gap-1">
                          <FiBox className="text-amber-400" />
                          <span className="text-amber-300 text-lg">
                            {totalItems}
                          </span>
                        </div>
                      </td>

                      <td
                        className={
                          "text-amber-300 text-lg flex items-center justify-center mt-[40%]"
                        }
                      >
                        <TbCurrencyTaka /> {totalPrice.toFixed(2)}
                      </td>

                      <td className={tableClasses.cellBase}>
                        <div className="flex flex-col gap-2">
                          <div
                            className={`${payMethod.class} px-3 py-1.5 rounded-lg border text-sm`}
                          >
                            {payMethod.label}
                          </div>
                          <div
                            className={`${payStatusStyle.color} flex items-center gap-2 text-sm`}
                          >
                            {iconMap[payStatusStyle.icon]}
                            <span>{payStatusStyle.label}</span>
                          </div>
                        </div>
                      </td>

                      <td className={tableClasses.cellBase}>
                        <div className="flex items-center gap-2">
                          <span className={`${stat.color} text-xl`}>
                            {iconMap[stat.icon]}
                          </span>

                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className={`px-4 py-2 rounded-lg ${stat.bg} ${stat.color} border border-amber-500/20 text-sm cursor-pointer`}
                          >
                            {Object.entries(statusStyles)
                              .filter(([k]) => k !== "succeeded")
                              .map(([Key, sty]) => (
                                <option
                                  value={Key}
                                  key={Key}
                                  className={` ${sty.color}  bg-blue-950`}
                                >
                                  {sty.label}
                                </option>
                              ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12 text-amber-100/60 text-xl">
              No orders found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
