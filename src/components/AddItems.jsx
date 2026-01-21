import React from "react";
import { useState } from "react";
import { styles } from "../assets/dummyadmin";
import { FiHeart, FiStar, FiUpload } from "react-icons/fi";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

import axios from "axios";

const AddItems = () => {
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    rating: 0,
    hearts: 0,
    total: 0,
    image: null,
    preview: "",
  });

  const [categories] = useState([
    "Breakfast",
    "Lunch",
    "Mexicon",
    "Italian",
    "Desserts",
    "Drinks",
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === "preview") return;
        payload.append(key, val);
      });

      const res = await axios.post(
        "https://food-delivery-app-server-six.vercel.app/api/item",
        payload,
      );

      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        rating: 0,
        hearts: 0,
        total: 0,
        image: null,
        preview: "",
      });
    } catch (err) {
      console.error("Error uploading item:", err.response || err.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleRating = (rating) => setFormData((prev) => ({ ...prev, rating }));

  const handleHeart = () =>
    setFormData((prev) => ({ ...prev, hearts: prev.hearts + 1 }));
  return (
    <div className={styles.formWrapper}>
      <div className="max-w-4xl mx-auto">
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Add New Menu Item</h2>

          <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
            <div className={styles.uploadWrapper}>
              <label className={styles.uploadLabel}>
                {formData.preview ? (
                  <img
                    src={formData.preview}
                    alt="preview"
                    className={styles.previewImage}
                  />
                ) : (
                  <div className="text-center p-4">
                    <FiUpload className="text-5xl  mx-auto text-amber-400" />
                    <p className={styles.uploadText}>
                      Click to upload product image
                    </p>
                  </div>
                )}
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  required
                />
              </label>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-base sm:text-lg text-amber-400">
                  Product Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.inputField}
                  placeholder="Enter Product Name"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-base sm:text-lg text-amber-400">
                  Desciption
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter Product Description"
                  className={styles.inputField + "h-32 sm:h-40 text-amber-100"}
                  required
                ></textarea>
              </div>

              <div className={styles.gridTwoCols}>
                <div>
                  <label className="block mb-2 text-base sm:text-lg text-amber-400">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`${styles.inputField}`}
                    required
                  >
                    <option value="">Select Category</option>

                    {categories.map((c) => (
                      <option key={c} className="bg-[#3a2b2b]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center  mb-2 text-base sm:text-lg text-amber-400 ">
                    Price (<FaBangladeshiTakaSign size={15} />)
                  </label>
                  <div className={styles.relativeInput}>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={
                        styles.inputField + "pl-10 sm:pl-12  text-amber-200"
                      }
                      placeholder="Enter Price"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className={styles.gridTwoCols}>
                <div>
                  <label className="block mb-2 text-base sm:text-lg text-amber-400">
                    Rating
                  </label>

                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-2xl sm:text-3xl transition-transform hover:scale-110"
                      >
                        <FiStar
                          className={
                            star <= (hoverRating || formData.rating)
                              ? "text-amber-400 fill-current"
                              : "text-amber-100/30"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-base sm:text-lg text-amber-400">
                    Popularity
                  </label>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={handleHeart}
                      className="text-2xl sm:text-3xl text-shadow-lime-400 hover:text-amber-300 transition-colors animate-pulse"
                    >
                      <FiHeart className="text-red-600" />
                    </button>

                    <input
                      type="number"
                      name="hearts"
                      value={formData.hearts}
                      onChange={handleInputChange}
                      className={
                        styles.inputField + "pl-10 sm:pl-12  text-amber-200"
                      }
                      placeholder="Enter Likes"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className={styles.actionBtn}>
                Add To{" "}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItems;
