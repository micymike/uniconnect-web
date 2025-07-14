import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, getAuthData, validateReferralCode, checkIfUserExists, signupwithemail } from "../api/auth";
import { signInWithGoogleCustom } from "../api/googleAuth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // State for Google OAuth post-redirect logic
  const [isGoogleProcessing, setIsGoogleProcessing] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralInput, setReferralInput] = useState("");
  const [tempGoogleData, setTempGoogleData] = useState(null);


  // (Google OAuth post-redirect useEffect removed - not needed for native Google OAuth flow)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setFormError("");

    let hasError = false;
    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    }
    if (!password || password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      hasError = true;
    }
    if (hasError) return;

    setIsSubmitting(true);
    const result = await signIn(email, password, true);
    setIsSubmitting(false);

    if (result.success) {
      setEmail("");
      setPassword("");
      navigate("/rentals");
    } else {
      setFormError(result.message || "Failed to sign in");
    }
  };

  // Handler for referral modal submission
  const handleReferralSubmit = async (e) => {
    e.preventDefault();
    setGoogleError("");
    setIsGoogleProcessing(true);

    if (!tempGoogleData) {
      setGoogleError("Session expired. Please try signing in again.");
      setIsGoogleProcessing(false);
      return;
    }

    try {
      let referralCode = referralInput.trim();
      if (referralCode) {
        const isValid = await validateReferralCode(referralCode);
        if (!isValid) {
          setGoogleError("Invalid referral code");
          setIsGoogleProcessing(false);
          return;
        }
      }

      const signupResult = await signupwithemail(
        tempGoogleData.googleemail,
        tempGoogleData.googlepassword,
        tempGoogleData.googleusername,
        tempGoogleData.googlePhotoUrl,
        referralCode || "",
        tempGoogleData.emailpasswordBoolean,
        ""
      );

      if (signupResult.success) {
        const sessionResult = await signIn(
          tempGoogleData.googleemail,
          tempGoogleData.googlepassword,
          tempGoogleData.emailpasswordBoolean
        );
        
        if (sessionResult.success) {
          setShowReferralModal(false);
          setReferralInput("");
          setTempGoogleData(null);
          navigate("/rentals");
        } else {
          setGoogleError("Account created but sign-in failed");
        }
      } else {
        setGoogleError(signupResult.message || "Failed to create account");
      }
    } catch (error) {
      setGoogleError("An error occurred during signup");
    } finally {
      setIsGoogleProcessing(false);
    }
  };

  // Handler for Google sign-in button
  const handleGoogleSignIn = async () => {
    setGoogleError("");
    setIsGoogleProcessing(true);
    
    try {
      const result = await signInWithGoogleCustom();
      
      if (!result?.data?.user) {
        setGoogleError("Sign-in was cancelled");
        return;
      }

      const googleusername = result.data.user.name;
      const googleemail = result.data.user.email;
      const googlepassword = `${googleemail}_GPass#123`;
      const googlePhotoUrl = result.data.user.photo;
      const emailpasswordBoolean = false;

      const userExists = await checkIfUserExists(googleemail);

      if (userExists) {
        // User exists - sign them in
        const sessionResult = await signIn(googleemail, googlepassword, emailpasswordBoolean);
        if (sessionResult.success) {
          navigate("/rentals");
        } else {
          setGoogleError(sessionResult.message || "Failed to sign in with Google");
        }
      } else {
        // User doesn't exist - show referral modal
        setTempGoogleData({
          googleemail,
          googleusername,
          googlePhotoUrl,
          googlepassword,
          emailpasswordBoolean
        });
        setShowReferralModal(true);
      }
    } catch (error) {
      setGoogleError("Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleProcessing(false);
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
      {showReferralModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <form onSubmit={handleReferralSubmit} style={{
            background: "#222",
            padding: 32,
            borderRadius: 12,
            boxShadow: "0 4px 32px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 320
          }}>
            <h3 style={{ color: "#fff", marginBottom: 12 }}>Enter Referral Code (optional)</h3>
            <input
              type="text"
              value={referralInput}
              onChange={e => setReferralInput(e.target.value)}
              placeholder="Referral code"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ccc",
                marginBottom: 12
              }}
              autoFocus
            />
            <button
              type="submit"
              disabled={isGoogleProcessing}
              style={{
                width: "100%",
                backgroundColor: "#ff8c00",
                color: "#fff",
                padding: 12,
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 8,
                cursor: isGoogleProcessing ? "not-allowed" : "pointer",
                border: "none"
              }}
            >
              {isGoogleProcessing ? "Processing..." : "Continue"}
            </button>
            <button
              type="button"
              onClick={() => { setShowReferralModal(false); setReferralInput(""); setTempGoogleData(null); }}
              style={{
                width: "100%",
                backgroundColor: "#444",
                color: "#fff",
                padding: 10,
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 15,
                border: "none",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            {googleError && <div style={{ color: "#ff4d4f", marginTop: 10 }}>{googleError}</div>}
          </form>
        </div>
      )}
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
        <h2 style={{ color: "#fff", fontWeight: 700, fontSize: 21, marginBottom: 10 }}>Sign in to your account</h2>
        <p style={{ color: "#788481", marginBottom: 20, fontSize: 15 }}>We missed you! Continue to your account</p>
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
            autoComplete="current-password"
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
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
        <button
          type="button"
          onClick={handleGoogleSignIn}
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
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: 8 }}>
            <g>
              <path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6-6C34.5 5.1 29.5 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.2-.3-3.5z"/>
              <path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c2.7 0 5.2.9 7.2 2.4l6-6C34.5 5.1 29.5 3 24 3c-7.7 0-14.3 4.3-17.7 10.7z"/>
              <path fill="#FBBC05" d="M24 43c5.4 0 10-1.8 13.3-4.9l-6.2-5.1C29.5 34.7 27 35.5 24 35.5c-5.5 0-10.1-3.7-11.7-8.7l-6.6 5.1C9.7 39.7 16.3 43 24 43z"/>
              <path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.1 3-3.7 5.5-7.3 6.5l6.2 5.1C39.7 39.7 44 32.9 44 24c0-1.3-.1-2.2-.3-3.5z"/>
            </g>
          </svg>
          Continue with Google
        </button>
        {formError && <div style={{ color: "#ff4d4f", marginBottom: 10 }}>{formError}</div>}
        {googleError && <div style={{ color: "#ff4d4f", marginBottom: 10 }}>{googleError}</div>}
        <div style={{ marginTop: 20 }}>
          <span style={{ color: "#788481" }}>
            Don't have an account?{" "}
            <span
              style={{ color: "#ff8c00", fontWeight: 600, cursor: "pointer" }}
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </span>
        </div>
      </form>
    </div>
  );
}
