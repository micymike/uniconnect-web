import React, { useEffect, useState } from "react";
import { Client, Databases, Query } from "appwrite";
import { Appwriteconfig } from "../appwriteenv";
import { getAuthData } from "../api/auth";
import { deletePropertyUnit } from "../api/rentals";
import { useNavigate } from "react-router-dom";

export default function MyRentalsDashboard() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const { user, session } = getAuthData();
    if (!user || !session) {
      window.location.href = "/signin";
      return;
    }
    setAuthChecking(false);

    async function fetchMyRentals() {
      setLoading(true);
      setError("");
      try {
        const client = new Client();
        client
          .setEndpoint(Appwriteconfig.endpoint)
          .setProject(Appwriteconfig.projectId);
        const databases = new Databases(client);

        // Query for rentals managed by the current user
        const res = await databases.listDocuments(
          Appwriteconfig.databaseId,
          Appwriteconfig.rentalPropertiesCollectionId,
          [Query.equal("managedBy", user.$id)]
        );
        setRentals(res.documents || []);
      } catch (err) {
        setError("Failed to fetch your rentals.");
        setRentals([]);
      }
      setLoading(false);
    }
    fetchMyRentals();
  }, []);

  if (authChecking) {
    return (
      <div className="text-white text-center py-10">Checking authentication...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-2">
      {/* Navigation Bar */}
      <div style={{
        width: "100%",
        maxWidth: 1200,
        margin: "16px auto 24px auto",
        display: "flex",
        gap: 12,
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "#232526",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            border: "1px solid #333",
            cursor: "pointer"
          }}
        >
          Home
        </button>
        <button
          onClick={() => navigate("/about")}
          style={{
            background: "#232526",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            border: "1px solid #333",
            cursor: "pointer"
          }}
        >
          About
        </button>
        <button
          onClick={() => navigate("/contact")}
          style={{
            background: "#232526",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            border: "1px solid #333",
            cursor: "pointer"
          }}
        >
          Contact
        </button>
        <button
          onClick={() => navigate("/terms")}
          style={{
            background: "#232526",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            border: "1px solid #333",
            cursor: "pointer"
          }}
        >
          Terms
        </button>
        <button
          onClick={() => navigate("/privacy")}
          style={{
            background: "#232526",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            border: "1px solid #333",
            cursor: "pointer"
          }}
        >
          Privacy
        </button>
        <button
          onClick={() => navigate("/profile")}
          style={{
            background: "#232526",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            border: "1px solid #333",
            cursor: "pointer"
          }}
        >
          Profile
        </button>
        <button
          onClick={() => navigate("/marketplace")}
          style={{
            background: "#232526",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            border: "1px solid #333",
            cursor: "pointer"
          }}
        >
          🛒 Marketplace
        </button>
        <button
          onClick={() => navigate("/rentals")}
          style={{
            background: "#ff8c00",
            color: "white",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            border: "none",
            cursor: "pointer"
          }}
        >
          🏠 Rentals
        </button>
        <button
          onClick={() => navigate("/add-rental")}
          style={{
            background: "#4caf50",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            border: "none",
            cursor: "pointer"
          }}
        >
          + Add Rental
        </button>
        <button
          onClick={() => navigate("/my-rentals-dashboard")}
          style={{
            background: "#232526",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            border: "1px solid #333",
            cursor: "pointer"
          }}
        >
          My Dashboard
        </button>
      </div>
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-accent mb-6 text-center">My Rentals Dashboard</h2>
        {loading ? (
          <div className="text-white text-center">Loading your rentals...</div>
        ) : error ? (
          <div className="bg-red-500/80 text-white rounded-lg px-4 py-2 text-center">{error}</div>
        ) : rentals.length === 0 ? (
          <div className="text-white text-center">You have not added any rentals yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rentals.map((rental) => {
              // Collect images: frontImage, backImage, or images array
              let images = [];
              if (rental.frontImage && typeof rental.frontImage === "string" && rental.frontImage.trim() !== "") {
                images.push(rental.frontImage.trim());
              }
              if (rental.backImage && typeof rental.backImage === "string" && rental.backImage.trim() !== "") {
                images.push(rental.backImage.trim());
              }
              if (rental.images && typeof rental.images === "string") {
                try {
                  const parsed = JSON.parse(rental.images);
                  if (Array.isArray(parsed)) {
                    images.push(...parsed.filter(img => typeof img === "string" && img.trim() !== ""));
                  }
                } catch {}
              }
              return (
                <div key={rental.$id} className="bg-gray-800 rounded-lg p-4 shadow flex flex-col">
                  {/* Image section */}
                  <div style={{
                    width: "100%",
                    height: 160,
                    overflow: "hidden",
                    background: "#232526",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    marginBottom: 12
                  }}>
                    {images.length > 0 ? (
                      <img
                        src={images[0]}
                        alt="Rental"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      <div style={{
                        color: "#aaa",
                        fontSize: 48
                      }}>
                        🏠
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-accent mb-2">{rental.title || rental.name}</h3>
                  <p className="text-white mb-1"><span className="font-semibold">Location:</span> {rental.location}</p>
                  <p className="text-white mb-1"><span className="font-semibold">Price:</span> {rental.Price || rental.price || "N/A"}</p>
                  <p className="text-white mb-1"><span className="font-semibold">Description:</span> {rental.description}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="bg-accent text-white px-3 py-1 rounded hover:bg-orange-500"
                      onClick={() => navigate(`/edit-rental/${rental.$id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this rental? This action cannot be undone.")) {
                          try {
                            const res = await deletePropertyUnit(rental.$id);
                            if (res && res.success) {
                              setRentals(rentals.filter(r => r.$id !== rental.$id));
                            } else {
                              alert("Failed to delete rental. Please try again.");
                            }
                          } catch (err) {
                            alert("Error deleting rental.");
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
