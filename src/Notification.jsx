import React, { useEffect, useRef } from "react";

export default function Notification({ show, message, onClose, duration = 2000, type = "success" }) {
  const timeout = useRef();

  useEffect(() => {
    if (show) {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        onClose();
      }, duration);
    }
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [show, duration, onClose]);

  if (!show) return null;
  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 2000,
        minWidth: 280,
        maxWidth: 400
      }}
    >
      {message}
      <button
        type="button"
        className="btn-close"
        aria-label="Fermer"
        style={{ float: "right" }}
        onClick={onClose}
      ></button>
    </div>
  );
}
