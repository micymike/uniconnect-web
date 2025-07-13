import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp, signIn, validateReferralCode } from "../api/auth";
import { signInWithGoogleCustom } from "../api/googleAuth";

function ReferralModal({ isVisible, onClose, onContinue, isLoading, modalError }) {
  const [referralCode, setReferralCode] = useState("");

  if (!isVisible) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: "#222", borderRadius: 12, padding: 32, minWidth: 320, color: "#fff", boxShadow: "0 4px 32px rgba(0,0,0,0.3)"
      }}>
        <h3 style={{ marginBottom: 16 }}>Enter Referral Code (optional)</h3>
        <input
          type="text"
          value={referralCode}
          onChange={e => setReferralCode(e.target.value)}
          placeholder="Referral code"
          style={{
            width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", marginBottom: 8
          }}
        />
        {modalError && <div style={{ color: "#ff4d4f", fontSize: 12, marginBottom: 8 }}>{modalError}</div>}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            onClick={() => onContinue(referralCode)}
            disabled={isLoading}
            style={{
              backgroundColor: "#ff8c00", color: "#fff", padding: "8px 16px", borderRadius: 6, border: "none", fontWeight: 600, cursor: "pointer"
            }}
          >
            {isLoading ? "Checking..." : "Continue"}
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#444", color: "#fff", padding: "8px 16px", borderRadius: 6, border: "none", fontWeight: 600, cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Referral modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalError, setModalError] = useState("");
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [referralCode, setReferralCode] = useState(null);
  
  // Google sign-in state
  const [isGoogleProcessing, setIsGoogleProcessing] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const navigate = useNavigate();

  const handleReferralModalContinue = async (code) => {
    setModalError("");
    setIsModalLoading(true);
    if (!code || code.trim() === "") {
      setReferralCode(null);
      setIsModalVisible(false);
      setIsModalLoading(false);
      return;
    }
    const isValid = await validateReferralCode(code.trim());
    setIsModalLoading(false);
    if (isValid) {
      setReferralCode(code.trim());
      setIsModalVisible(false);
    } else {
      setModalError("Invalid referral code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setFormError("");

    let hasError = false;
    if (!username) {
      setUsernameError("Username is required");
      hasError = true;
    }
    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email address");
        hasError = true;
      }
    }
    if (!password || password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      hasError = true;
    }
    if (hasError) return;

    setIsSubmitting(true);
    const result = await signUp({
      email,
      password,
      username,
      googlePhotoUrl: null,
      referredByCode: referralCode,
      emailpasswordBoolean: true,
      pushToken: "",
    });

    if (!result.success) {
      setIsSubmitting(false);
      if (result.message && result.message.includes("Email is already taken")) {
        setEmailError(result.message);
      } else {
        setFormError(result.message || "Failed to sign up");
      }
      return;
    }

    // Auto sign-in after sign-up
    const session = await signIn(email, password, true);
    setIsSubmitting(false);

    if (session.success) {
      setEmail("");
      setPassword("");
      setUsername("");
      setReferralCode(null);
      setEmailError("");
      setPasswordError("");
      setUsernameError("");
      navigate("/rentals");
    } else {
      setFormError(session.message || "Sign-in after sign-up failed");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #464646, #464646, #030406, #000, #000, #000)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: 12,
          padding: 32,
          width: 350,
          boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <img
          src="/src/uniconnect_mobile/assets/icons/adaptive-icon.png"
          alt="Uniconnect Icon"
          style={{ width: 80, height: 80, borderRadius: "50%", marginBottom: 16 }}
        />
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 21, marginBottom: 10 }}>Sign up for an account</h2>
        <p style={{ color: "#788481", marginBottom: 20, fontSize: 15 }}>Create a new account to get started</p>
        <div style={{ width: "100%", marginBottom: 16 }}>
          <label style={{ color: "#fff", fontWeight: 500, marginBottom: 4, display: "block" }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => { setUsername(e.target.value); setUsernameError(""); }}
            placeholder="John Doe"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              marginBottom: 4
            }}
            autoComplete="username"
          />
          {usernameError && <div style={{ color: "#ff4d4f", fontSize: 12 }}>{usernameError}</div>}
        </div>
        <div style={{ width: "100%", marginBottom: 16 }}>
          <label style={{ color: "#fff", fontWeight: 500, marginBottom: 4, display: "block" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setEmailError(""); }}
            placeholder="testemail@gmail.com"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              marginBottom: 4
            }}
            autoComplete="email"
          />
          {emailError && <div style={{ color: "#ff4d4f", fontSize: 12 }}>{emailError}</div>}
        </div>
        <div style={{ width: "100%", marginBottom: 16 }}>
          <label style={{ color: "#fff", fontWeight: 500, marginBottom: 4, display: "block" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setPasswordError(""); }}
            placeholder="********"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              marginBottom: 4
            }}
            autoComplete="new-password"
          />
          {passwordError && <div style={{ color: "#ff4d4f", fontSize: 12 }}>{passwordError}</div>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            backgroundColor: "#ff8c00",
            color: "#fff",
            padding: 12,
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            marginTop: 8,
            marginBottom: 16,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            border: "none"
          }}
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>
        <button
          type="button"
          onClick={() => {
            setGoogleError("");
            setIsGoogleProcessing(true);
            signInWithGoogleCustom()
              .then(result => {
                if (result?.data?.user) {
                  navigate("/signin"); // Redirect to sign-in page to handle Google auth
                }
              })
              .catch(error => {
                setGoogleError("Google sign-in failed. Please try again.");
              })
              .finally(() => {
                setIsGoogleProcessing(false);
              });
          }}
          style={{
            width: "100%",
            backgroundColor: "#fff",
            color: "#444",
            padding: 12,
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 16,
            border: "1px solid #ccc",
            display: "flex",
            cursor: isGoogleProcessing ? "not-allowed" : "pointer",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer"
          }}
        >
          {isGoogleProcessing ? (
            "Processing..."
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
                <g>
                  <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6-6C34.5 5.1 29.5 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.2-.3-3.5z"/>
                  <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c2.7 0 5.2.9 7.2 2.4l6-6C34.5 5.1 29.5 3 24 3c-7.7 0-14.3 4.3-17.7 10.7z"/>
                  <path fill="#FBBC05" d="M24 43c5.4 0 10-1.8 13.3-4.9l-6.2-5.1C29.5 34.7 27 35.5 24 35.5c-5.5 0-10.1-3.7-11.7-8.7l-6.6 5.1C9.7 39.7 16.3 43 24 43z"/>
                  <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 3-3.7 5.5-7.3 6.5l6.2 5.1C39.7 39.7 44 32.9 44 24c0-1.3-.1-2.2-.3-3.5z"/>
                </g>
              </svg>
              Continue with Google
            </>
          )}
        </button>
        {googleError && <div style={{ color: "#ff4d4f", marginBottom: 10 }}>{googleError}</div>}
        <button
          type="button"
          style={{
            background: "none",
            color: "#ff8c00",
            border: "none",
            fontWeight: 600,
            marginBottom: 10,
            cursor: "pointer"
          }}
          onClick={() => setIsModalVisible(true)}
        >
          Have a referral code?
        </button>
        {formError && <div style={{ color: "#ff4d4f", marginBottom: 10 }}>{formError}</div>}
        <div style={{ marginTop: 20 }}>
          <span style={{ color: "#788481" }}>
            Already have an account?{" "}
            <span
              style={{ color: "#ff8c00", fontWeight: 600, cursor: "pointer" }}
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </span>
        </div>
      </form>
      <ReferralModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onContinue={handleReferralModalContinue}
        isLoading={isModalLoading}
        modalError={modalError}
      />
    </div>
  );
}
