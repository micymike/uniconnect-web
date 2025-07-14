import React, { useEffect, useState } from "react";

// Placeholder for notification and toast hooks
// import { useNotification } from "../uniconnect_mobile/context/NotificationContext";
// import { useToast } from "../uniconnect_mobile/context/ToastProvider";

// Placeholder for colors
const Primary = "#ff8c00";
const secondary = "#464646";
const Gray = "#CBCED4";

export default function MobileDashboard() {
  // Placeholder states
  const [userHasSession, setUserHasSession] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmittingToGoogle, setIsSubmittingToGoogle] = useState(false);

  // Placeholder for checking auth (simulate async)
  useEffect(() => {
    setIsCheckingAuth(true);
    setTimeout(() => {
      setUserHasSession(false);
      setIsCheckingAuth(false);
    }, 1000);
  }, []);

  if (isCheckingAuth || userHasSession) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #464646, #464646, #030406, #000, #000, #000)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div className="loader" style={{ margin: "0 auto" }} />
          <p style={{ color: "#fff", marginTop: 10, fontSize: 14 }}>
            {isCheckingAuth ? "Checking session..." : "Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #464646, #464646, #030406, #000, #000, #000)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      padding: 16
    }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>Find It. Have It. List It.</h1>
        <h2 style={{ color: Primary, fontSize: 23, fontWeight: 800 }}>Uniconnect.</h2>
        <p style={{ color: Gray, fontSize: 14, fontWeight: 500, maxWidth: "86%", margin: "0 auto" }}>
          Find rental spaces, buy what you need, and sell what you no longer use
        </p>
      </div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <img
          src="/src/uniconnect_mobile/assets/icons/adaptive-icon.png"
          alt="Uniconnect Icon"
          style={{ width: 120, height: 120, borderRadius: "50%" }}
        />
        <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 20, marginBottom: 7 }}>
          Welcome To <span style={{ color: Primary }}>Uniconnect</span>
        </h3>
        <p style={{ color: "#788481", marginBottom: 10, fontSize: 14 }}>
          Sign In to access your account
        </p>
        <button
          disabled={isSubmittingToGoogle}
          style={{
            width: "80%",
            backgroundColor: secondary,
            padding: 12,
            borderRadius: 9,
            marginBottom: 20,
            color: "#fff",
            border: "0.4px solid " + Gray,
            fontWeight: 600,
            cursor: "pointer"
          }}
          onClick={() => alert("Google Sign-In (to be implemented)")}
        >
          Continue With Google
        </button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ backgroundColor: Gray, width: 70, height: 1 }} />
          <span style={{ color: "white", margin: "0 10px" }}>OR</span>
          <div style={{ backgroundColor: Gray, width: 70, height: 1 }} />
        </div>
        <button
          style={{
            width: "80%",
            backgroundColor: Primary,
            padding: 10,
            borderRadius: 9,
            marginBottom: 20,
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer"
          }}
          onClick={() => alert("Email Sign-In (to be implemented)")}
        >
          Sign In with Email
        </button>
        <div style={{ marginTop: 10 }}>
          <span style={{ color: "#788481" }}>
            Don't have an account?{" "}
            <span style={{ color: "#ff8c00", fontWeight: 600, cursor: "pointer" }} onClick={() => alert("Signup (to be implemented)")}>
              Signup
            </span>
          </span>
        </div>
        <div style={{ width: "100%", backgroundColor: Gray, height: 1, marginTop: 30 }} />
      </div>
      <div style={{ textAlign: "center", margin: "10px 0", padding: "5px 0" }}>
        <span style={{ color: "#788481" }}>© 2025 Uniconnect. All rights reserved.</span>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 6, gap: 20 }}>
          <a href="https://www.uniconnect.store/terms" style={{ color: "#788481" }}>Terms</a>
          <a href="https://www.uniconnect.store/privacy" style={{ color: "#788481" }}>Privacy</a>
          <a href="https://www.uniconnect.store/contact" style={{ color: "#788481" }}>Help</a>
        </div>
      </div>
    </div>
  );
}
