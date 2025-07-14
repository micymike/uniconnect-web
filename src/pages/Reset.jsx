import React, { useState } from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Reset() {
  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-custom text-white">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-black/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 p-8 md:p-12 mx-4 glassmorphism relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Update password, email or phone
          </h1>
          <p className="mb-6 text-white/80">
            How would you like to reset your password?
          </p>
          <div className="flex flex-col gap-2 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="method"
                value="email"
                checked={method === "email"}
                onChange={() => setMethod("email")}
                className="accent-accent w-5 h-5"
              />
              <span className="text-white">Email</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="method"
                value="sms"
                checked={method === "sms"}
                onChange={() => setMethod("sms")}
                className="accent-accent w-5 h-5"
              />
              <span className="text-white">Text Message (SMS)</span>
            </label>
          </div>
          <div className="mb-4">
            {method === "email" ? (
              <>
                <p className="mb-2 text-white/80">
                  We will send you an email with instructions on how to reset your password.
                </p>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-black/40 text-white focus:outline-none focus:border-accent transition-all mb-2"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </>
            ) : (
              <>
                <p className="mb-2 text-white/80">
                  We will send you a text message with instructions on how to reset your password.
                </p>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-black/40 text-white focus:outline-none focus:border-accent transition-all mb-2"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  autoComplete="tel"
                />
              </>
            )}
          </div>
          <button
            className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 rounded-lg transition-all duration-300 text-lg shadow-lg mt-2"
            type="button"
            // onClick={handleReset} // Implement logic as needed
          >
            {method === "email" ? "Email Me" : "Text Me"}
          </button>
          <div className="mt-6 text-center">
            <Link
              to="#"
              className="underline text-white/80 hover:text-accent transition-colors"
            >
              I don't remember my email or phone.
            </Link>
          </div>
        </div>
      </div>
      <Footer className="mt-24" />
    </div>
  );
}
