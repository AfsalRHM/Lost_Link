import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

// Success Toast
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};

// Error Toast
export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};

// Logout Confirmation Toast
export const showLogoutConfirmation = (
  message: string,
  onConfirm: () => void
) => {
  toast(
    React.createElement(
      "div",
      {
        style: {
          padding: "20px",
          textAlign: "center",
          fontSize: "16px",
          fontWeight: "500",
          color: "#333",
        },
      },
      React.createElement("p", { style: { marginBottom: "15px" } }, message),
      React.createElement(
        "div",
        {
          style: {
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            marginTop: "10px",
          },
        },
        React.createElement(
          "button",
          {
            style: {
              backgroundColor: "#d9534f",
              color: "white",
              border: "none",
              padding: "8px 15px",
              cursor: "pointer",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "bold",
              transition: "background 0.3s",
              boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
            },
            onClick: () => {
              onConfirm();
              toast.dismiss();
            },
            onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = "#c9302c"),
            onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = "#d9534f"),
          },
          "Yes, Logout"
        ),
        React.createElement(
          "button",
          {
            style: {
              backgroundColor: "#5bc0de",
              color: "white",
              border: "none",
              padding: "8px 15px",
              cursor: "pointer",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "bold",
              transition: "background 0.3s",
              boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
            },
            onClick: () => toast.dismiss(),
            onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = "#31b0d5"),
            onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.backgroundColor = "#5bc0de"),
          },
          "Cancel"
        )
      )
    ),
    {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    }
  );
};
