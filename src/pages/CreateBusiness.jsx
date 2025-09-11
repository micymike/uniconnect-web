import React, { useState } from "react";
import { getAuthData } from "../api/auth";
import { createBusiness } from "../api/business";
import { useNavigate } from "react-router-dom";

export default function CreateBusiness() {
  const { user } = getAuthData() || {};
  const [businessname, setBusinessname] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  if (!user) {
    window.location.href = "/signin";
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");
    if (!businessname.trim()) {
      setFeedback("Business name is required.");
      return;
    }
    setLoading(true);
    const res = await createBusiness({ businessname, userId: user.$id });
    setLoading(false);
    if (res.success) {
      setFeedback("Business created successfully!");
      setTimeout(() => {
        navigate("/profile");
      }, 1200);
    } else {
      setFeedback(res.message || "Failed to create business.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        fontWeight: 600,
      }}
    >
      <div style={{ background: "#181818", padding: 32, borderRadius: 16, minWidth: 340 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "#ff8c00",
            fontSize: 16,
            fontWeight: 500,
            marginBottom: 10,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 20 }}>←</span> Back
        </button>
        <h2 style={{ marginBottom: 16 }}>Create Business Profile</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <label style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>
            Business Name
            <input
              type="text"
              value={businessname}
              onChange={(e) => setBusinessname(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #333",
                background: "#232526",
                color: "#fff",
                fontSize: 16,
                marginTop: 6,
                marginBottom: 12,
              }}
              placeholder="Enter your business name"
              disabled={loading}
              autoFocus
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#ff8c00",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 0",
              fontWeight: 700,
              fontSize: 17,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              marginTop: 8,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Creating..." : "Create Business"}
          </button>
        </form>
        {feedback && (
          <div
            style={{
              marginTop: 18,
              color: feedback.includes("success") ? "#4caf50" : "#EF4444",
              fontSize: 16,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}
