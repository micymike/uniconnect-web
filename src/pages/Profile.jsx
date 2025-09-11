import React, { useState, useEffect } from "react";
import { getAuthData, signOut } from "../api/auth";
import { getBusinessByUserId } from "../api/business";
import { useNavigate } from "react-router-dom";

const COLORS = {
  background: "#000",
  card: "#181818",
  secondary: "#232526",
  accent: "#ff8c00",
  white: "#fff",
  gray: "#aaa",
  silver: "#ccc",
  green: "#4caf50",
  orange: "#ff8c00",
  red: "#EF4444",
};

function formatMonthYear(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const options = { year: "numeric", month: "long" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export default function Profile() {
  const { user } = getAuthData() || {};
  const [businessMode, setBusinessMode] = useState(() => {
    const stored = localStorage.getItem("businessMode");
    return stored === "true";
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [businessData, setBusinessData] = useState(null);
  const [isBusinessLoading, setIsBusinessLoading] = useState(false);
  
  // Reset business data when business mode is turned off
  useEffect(() => {
    if (!businessMode) {
      setBusinessData(null);
      setIsBusinessLoading(false);
    }
  }, [businessMode]);
  const navigate = useNavigate();

  // Fetch business data when business mode is enabled
  useEffect(() => {
    let isMounted = true;
    
    if (businessMode && user?.$id && businessData === null && !isBusinessLoading) {
      setIsBusinessLoading(true);
      getBusinessByUserId(user.$id)
        .then((res) => {
          if (!isMounted) return;
          if (res.success) {
            setBusinessData(res.business);
          } else {
            setBusinessData(false); // Use false to indicate "no business found"
          }
        })
        .catch((error) => {
          if (isMounted) {
            console.error('Error fetching business data:', error);
            setBusinessData(false);
          }
        })
        .finally(() => {
          if (isMounted) setIsBusinessLoading(false);
        });
    }
    
    return () => {
      isMounted = false;
    };
  }, [businessMode, user?.$id]);

  if (!user) {
    window.location.href = "/signin";
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    setIsLoggingOut(false);
    window.location.href = "/signin";
  };

  // Prefer googlePhotoUrl, then prefs.avatar, then fallback to initials
  const profileImg =
    user.googlePhotoUrl ||
    (user.prefs && user.prefs.avatar) ||
    null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 0",
      }}
    >
      {/* Back Button */}
      <div style={{ width: "100%", maxWidth: 400, marginBottom: 12 }}>
        <button
          onClick={() => {
            navigate("/rentals");
          }}
          style={{
            background: "none",
            border: "none",
            color: COLORS.accent,
            fontSize: 16,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 20 }}>←</span> 
          {businessMode ? "Business Dashboard" : "Rentals"}
        </button>
      </div>
      <div
        style={{
          background: COLORS.card,
          borderRadius: 16,
          padding: 32,
          minWidth: 340,
          maxWidth: 400,
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
          marginBottom: 32,
        }}
      >
        {/* User Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
            gap: 16,
          }}
        >
          {profileImg ? (
            <img
              src={profileImg}
              alt="Profile"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                objectFit: "cover",
                background: COLORS.secondary,
              }}
            />
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: COLORS.secondary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                color: COLORS.white,
                fontWeight: 700,
              }}
            >
              {user.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"}
            </div>
          )}
          <div>
            <div
              style={{
                color: COLORS.white,
                fontWeight: 700,
                fontSize: 20,
                marginBottom: 4,
              }}
            >
              {user.name || "User"}
            </div>
            <div style={{ color: COLORS.gray, fontSize: 15 }}>
              {user.email}
            </div>
            <div style={{ color: COLORS.silver, fontSize: 13, marginTop: 2 }}>
              Joined {formatMonthYear(user.$createdAt)}
            </div>
          </div>
        </div>
        {/* Business Mode Toggle */}
        <div
          style={{
            marginTop: 10,
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: COLORS.secondary,
            borderRadius: 10,
            padding: "10px 16px",
          }}
        >
          <span
            style={{
              color: COLORS.white,
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            Business Mode
          </span>
          <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={businessMode}
              onChange={() => {
                setBusinessMode((b) => {
                  const next = !b;
                  localStorage.setItem("businessMode", next ? "true" : "false");
                  return next;
                });
              }}
              style={{ display: "none" }}
            />
            <span
              style={{
                width: 38,
                height: 22,
                background: businessMode ? COLORS.accent : "#374151",
                borderRadius: 12,
                position: "relative",
                display: "inline-block",
                transition: "background 0.2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: businessMode ? 18 : 2,
                  top: 2,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: businessMode ? COLORS.orange : "#9CA3AF",
                  transition: "left 0.2s, background 0.2s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                }}
              />
            </span>
          </label>
        </div>
        {/* Business Card or Life Tips */}
        <div style={{ margin: "18px 0" }}>
          {businessMode ? (
            isBusinessLoading ? (
              <div style={{ color: COLORS.gray, textAlign: "center", padding: 16 }}>Loading business info...</div>
            ) : businessData ? (
              <>
                <div
                  style={{
                    background: COLORS.secondary,
                    borderRadius: 10,
                    padding: 16,
                    marginBottom: 10,
                    color: COLORS.white,
                    fontWeight: 600,
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/rentals")}
                >
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{businessData.name}</div>
                  <div style={{ fontSize: 14, color: COLORS.gray }}>Rental & market</div>
                  <div style={{ fontSize: 13, color: COLORS.silver, marginTop: 2 }}>
                    Joined {formatMonthYear(businessData.$createdAt)}
                  </div>
                </div>
                <button
                  onClick={() => navigate("/add-rental")}
                  style={{
                    background: COLORS.accent,
                    color: COLORS.white,
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 18px",
                    fontWeight: 600,
                    fontSize: 15,
                    marginBottom: 10,
                    cursor: "pointer",
                    width: "100%",
                    maxWidth: 300,
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto"
                  }}
                >
                  + Add Property
                </button>
              </>
            ) : (
              <div
                style={{
                  background: COLORS.accent,
                  color: COLORS.white,
                  borderRadius: 10,
                  padding: 16,
                  fontWeight: 600,
                  textAlign: "center",
                  cursor: "pointer",
                  marginBottom: 10,
                }}
                onClick={() => navigate("/createbusiness")}
              >
                + Create Business Profile
              </div>
            )
          ) : (
            <div
              style={{
                background: COLORS.secondary,
                color: COLORS.white,
                borderRadius: 10,
                padding: 16,
                fontWeight: 500,
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              💡 Life Tip: Stay organized and keep your business info up to date!
            </div>
          )}
        </div>
        {/* Settings Section */}
        <div
          style={{
            marginTop: 10,
            borderRadius: 12,
            padding: 0,
            background: "none",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 500, padding: "10px 0", color: COLORS.white }}>
            Settings
          </div>
          <button
            onClick={() => navigate("/subscription")}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              background: "none",
              border: "none",
              color: COLORS.white,
              fontSize: 15,
              padding: "12px 0",
              cursor: "pointer",
              textAlign: "left",
              borderBottom: "1px solid #232526",
            }}
          >
            <span style={{ width: 30, display: "inline-block", textAlign: "center", color: "#777" }}>💳</span>
            <span style={{ flex: 1, marginLeft: 10 }}>Payment Settings</span>
            <span style={{ color: COLORS.gray, marginRight: 6 }}>›</span>
          </button>
          <button
            onClick={() => navigate("/referral")}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              background: "none",
              border: "none",
              color: COLORS.white,
              fontSize: 15,
              padding: "12px 0",
              cursor: "pointer",
              textAlign: "left",
              borderBottom: "1px solid #232526",
            }}
          >
            <span style={{ width: 30, display: "inline-block", textAlign: "center", color: "#777" }}>�</span>
            <span style={{ flex: 1, marginLeft: 10 }}>Referral Program</span>
            <span style={{ color: COLORS.gray, marginRight: 6 }}>›</span>
          </button>
          <button
            onClick={() => navigate("/help")}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              background: "none",
              border: "none",
              color: COLORS.white,
              fontSize: 15,
              padding: "12px 0",
              cursor: "pointer",
              textAlign: "left",
              borderBottom: "1px solid #232526",
            }}
          >
            <span style={{ width: 30, display: "inline-block", textAlign: "center", color: "#777" }}>❓</span>
            <span style={{ flex: 1, marginLeft: 10 }}>Help Center</span>
            <span style={{ color: COLORS.gray, marginRight: 6 }}>›</span>
          </button>
        </div>
        {/* Logout Button */}
        <button
          disabled={isLoggingOut}
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            background: "rgba(239, 68, 68, 0.2)",
            border: "none",
            color: COLORS.red,
            fontSize: 15,
            fontWeight: 500,
            borderRadius: 12,
            padding: "10px 0",
            marginTop: 18,
            cursor: isLoggingOut ? "not-allowed" : "pointer",
            opacity: isLoggingOut ? 0.7 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {isLoggingOut ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="spinner" style={{
                width: 16, height: 16, border: "2px solid #EF4444", borderTop: "2px solid transparent",
                borderRadius: "50%", display: "inline-block", marginRight: 6, animation: "spin 1s linear infinite"
              }} />
              Logging Out...
            </span>
          ) : (
            <>
              <span style={{ marginRight: 6 }}>🚪</span>
              Log Out
            </>
          )}
        </button>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg);}
              100% { transform: rotate(360deg);}
            }
          `}
        </style>
      </div>
    </div>
  );
}
