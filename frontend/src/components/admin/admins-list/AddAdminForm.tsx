import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { adminService } from "../../../services/adminService";

import { showSuccessToast } from "../../../utils/toastUtils";

const AddAdminForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "Admin",
    password: "",
    status: "active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address.";
    if (!formData.password || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await adminService.insertAdmin(formData);

      showSuccessToast("Admin created successfully.");
      navigate("/admin/admins");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 bg-blue-900 text-white flex justify-center items-center">
      <div className="bg-blue-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-center mb-4">Add Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`w-full px-4 py-2 border rounded-lg bg-blue-300 text-white ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`w-full px-4 py-2 border rounded-lg bg-blue-300 text-white ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              className="w-full px-4 py-2 border rounded-lg bg-blue-300 text-white"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`w-full px-4 py-2 border rounded-lg bg-blue-300 text-white ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminForm;
