import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createupload } from "../api/rentals";
import { getAuthData } from "../api/auth";
import { getBusinessByUserId } from "../api/business";

export default function AddRental() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    frontImage: null,
    backImage: null,
  });
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState(null);
  const [businessId, setBusinessId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { user } = getAuthData();
    if (user && user.$id) {
      setUserId(user.$id);
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchBusiness() {
      if (userId) {
        const res = await getBusinessByUserId(userId);
        if (res.success && res.business && res.business.$id) {
          setBusinessId(res.business.$id);
        } else {
          setBusinessId(null);
        }
      }
    }
    fetchBusiness();
  }, [userId]);

  // Step validation
  const canNextStep = () => {
    if (step === 1) {
      return form.name && form.location && form.price;
    }
    if (step === 2) {
      return form.description;
    }
    if (step === 3) {
      return form.frontImage && form.backImage;
    }
    return false;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFrontImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, frontImage: file }));
      setFrontPreview(URL.createObjectURL(file));
    }
  };

  const handleBackImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, backImage: file }));
      setBackPreview(URL.createObjectURL(file));
    }
  };

  const removeFrontImage = () => {
    setForm((prev) => ({ ...prev, frontImage: null }));
    setFrontPreview(null);
  };

  const removeBackImage = () => {
    setForm((prev) => ({ ...prev, backImage: null }));
    setBackPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!userId) {
      setError("User not authenticated. Please sign in again.");
      setLoading(false);
      return;
    }
    if (!businessId) {
      setError("Business profile not found. Please create a business profile first.");
      setLoading(false);
      return;
    }

    try {
      // Use the mobile version's createupload approach
      const rentalData = {
        frontImage: form.frontImage,
        backImage: form.backImage,
        title: form.name,
        description: form.description,
        location: form.location,
        Price: form.price, // Save price as "Price" (capital P)
        latitude: "",
        longitude: "",
        agreed: true,
        managedBy: userId,
        contactPhone: ""
      };
      
      const result = await createupload(rentalData);

      if (result.success) {
        setSuccess("Rental property added!");
        setTimeout(() => {
          navigate("/rentals");
        }, 1200);
      } else {
        setError(result.message || "Failed to add rental.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Stepper UI
  const steps = [
    { label: "Property Details" },
    { label: "Description" },
    { label: "Images & Review" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10">
        <button
          type="button"
          onClick={() => navigate("/rentals")}
          className="mb-4 text-white hover:text-accent font-semibold flex items-center gap-2 focus:outline-none"
        >
          <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex items-center justify-center mb-8">
          {steps.map((s, idx) => (
            <div key={s.label} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg
                  ${step === idx + 1
                    ? "bg-accent text-white"
                    : step > idx + 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-300"
                  }`}
              >
                {idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div className="w-10 h-1 bg-gray-500 mx-2 rounded" />
              )}
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-accent mb-6 text-center">
          {steps[step - 1].label}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <>
              <div>
                <label className="block text-white font-semibold mb-2">
                  Property Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-accent transition"
                  placeholder="e.g. Cozy Bedsitter"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-accent transition"
                  placeholder="e.g. Juja, Gate C"
                />
              </div>
              <div className="mb-8">
                <label className="block text-white font-semibold mb-2">
                  Price (Ksh)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-accent transition"
                  placeholder="e.g. 8000"
                />
              </div>
            </>
          )}
          {step === 2 && (
            <div className="mb-8">
              <label className="block text-white font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-accent transition resize-vertical"
                placeholder="Describe the property, amenities, etc."
              />
            </div>
          )}
          {step === 3 && (
            <>
              <div className="mb-8">
                <label className="block text-white font-semibold mb-2">
                  Images
                </label>
                <div className="flex gap-6">
                  {/* Front Image */}
                  <div className="flex flex-col items-center">
                    <label className="text-white mb-1">Front View</label>
                    <div className="relative w-28 h-28 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center bg-gray-800">
                      {frontPreview ? (
                        <>
                          <button
                            type="button"
                            onClick={removeFrontImage}
                            className="absolute top-1 right-1 bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center z-10"
                            title="Remove"
                          >
                            &times;
                          </button>
                          <img
                            src={frontPreview}
                            alt="Front Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </>
                      ) : (
                        <>
                          <label
                            htmlFor="frontImage"
                            className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                          >
                            <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-xs text-gray-400">Add Front</span>
                            <input
                              id="frontImage"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFrontImageChange}
                            />
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Back Image */}
                  <div className="flex flex-col items-center">
                    <label className="text-white mb-1">Back View</label>
                    <div className="relative w-28 h-28 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center bg-gray-800">
                      {backPreview ? (
                        <>
                          <button
                            type="button"
                            onClick={removeBackImage}
                            className="absolute top-1 right-1 bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center z-10"
                            title="Remove"
                          >
                            &times;
                          </button>
                          <img
                            src={backPreview}
                            alt="Back Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </>
                      ) : (
                        <>
                          <label
                            htmlFor="backImage"
                            className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                          >
                            <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-xs text-gray-400">Add Back</span>
                            <input
                              id="backImage"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleBackImageChange}
                            />
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Tip: Include clear photos of the front and back of your property.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 mt-4">
                <h3 className="text-lg font-semibold text-accent mb-2">Review Details</h3>
                <ul className="text-white space-y-1">
                  <li>
                    <span className="font-semibold">Name:</span> {form.name}
                  </li>
                  <li>
                    <span className="font-semibold">Location:</span> {form.location}
                  </li>
                  <li>
                    <span className="font-semibold">Price:</span> {form.price}
                  </li>
                  <li>
                    <span className="font-semibold">Description:</span> {form.description}
                  </li>
                  <li>
                    <span className="font-semibold">Front Image:</span>{" "}
                    {frontPreview ? "Selected" : "None"}
                  </li>
                  <li>
                    <span className="font-semibold">Back Image:</span>{" "}
                    {backPreview ? "Selected" : "None"}
                  </li>
                </ul>
              </div>
            </>
          )}
          {error && (
            <div className="bg-red-500/80 text-white rounded-lg px-4 py-2 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/80 text-white rounded-lg px-4 py-2 text-center">
              {success}
            </div>
          )}
          <div className="flex justify-between gap-3 pt-2">
            {step > 1 && (
              <button
                type="button"
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow transition"
                onClick={() => setStep((s) => s - 1)}
                disabled={loading}
              >
                Back
              </button>
            )}
            {step < steps.length && (
              <button
                type="button"
                className={`bg-accent hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-lg shadow transition flex-1 ${!canNextStep() ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                onClick={() => canNextStep() && setStep((s) => s + 1)}
                disabled={!canNextStep() || loading}
              >
                Next
              </button>
            )}
            {step === steps.length && (
              <button
                type="submit"
                disabled={loading || !userId || !businessId}
                className="w-full bg-accent hover:bg-orange-500 text-white font-bold py-3 rounded-lg shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed text-lg"
              >
                {loading || !userId || !businessId ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    { !userId ? "Loading user..." : !businessId ? "Loading business..." : "Adding..." }
                  </span>
                ) : (
                  "Add Rental"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
