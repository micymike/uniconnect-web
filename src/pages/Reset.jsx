import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Reset() {
  const [method, setMethod] = useState("email");
  const [input, setInput] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Update password, email or phone
        </h1>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          How would you like to reset your password?
        </p>
        <div className="mb-4">
          <label className="flex items-center mb-2 cursor-pointer">
            <input
              type="radio"
              name="method"
              value="email"
              checked={method === "email"}
              onChange={() => setMethod("email")}
              className="form-radio h-4 w-4 text-red-600"
            />
            <span className="ml-2 text-gray-900 dark:text-gray-200">Email</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="method"
              value="sms"
              checked={method === "sms"}
              onChange={() => setMethod("sms")}
              className="form-radio h-4 w-4 text-red-600"
            />
            <span className="ml-2 text-gray-900 dark:text-gray-200">Text Message (SMS)</span>
          </label>
        </div>
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          {method === "email"
            ? "We will send you an email with instructions on how to reset your password."
            : "We will send you a text message with instructions on how to reset your password."}
        </p>
        <input
          type={method === "email" ? "email" : "tel"}
          placeholder={method === "email" ? "Email" : "Phone number"}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition-colors mb-4"
          // onClick={handleSubmit} // Placeholder for future logic
        >
          {method === "email" ? "Email Me" : "Text Me"}
        </button>
        <div className="text-center">
          <Link
            to="#"
            className="text-sm text-gray-900 dark:text-gray-200 underline hover:text-red-600"
          >
            I don't remember my email or phone.
          </Link>
        </div>
      </div>
    </div>
  );
}
