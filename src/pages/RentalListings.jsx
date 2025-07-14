import React, { useEffect, useState, useRef } from "react";
import { fetchRentals, fetchAllUnits } from "../api/rentals";
import { getAuthData } from "../api/auth";

// Color palette (from mobile)
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
  badge: "#2a1205",
};

const POPULAR_SEARCHES = [
  { id: 1, name: "bed sitter" },
  { id: 2, name: "one bedroom" },
  { id: 3, name: "single room" },
  { id: 4, name: "double room" },
];

function RentalCard({ unit, onClick }) {
  const property = unit.property || {};
  const images = property.images && Array.isArray(property.images)
    ? property.images
    : (property.images ? JSON.parse(property.images) : []);
  
  return (
    <div
      onClick={onClick}
      style={{
        background: COLORS.card,
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        border: "1px solid #333",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-4px)";
        e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "none";
      }}
    >
      {/* Image Section */}
      <div style={{
        width: "100%",
        height: 200,
        overflow: "hidden",
        background: COLORS.secondary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}>
        {images.length > 0 ? (
          <img
            src={images[0]}
            alt="Rental Property"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        ) : (
          <div style={{
            color: COLORS.gray,
            fontSize: 48
          }}>
            🏠
          </div>
        )}
        
        {/* Status Badges */}
        <div style={{
          position: "absolute",
          top: 12,
          left: 12,
          display: "flex",
          gap: 6
        }}>
          {unit.isFurnished && (
            <span style={{
              background: "rgba(255, 140, 0, 0.9)",
              color: "white",
              borderRadius: 12,
              padding: "4px 8px",
              fontSize: 11,
              fontWeight: 600
            }}>Furnished</span>
          )}
          {unit.vacancyStatus && (
            <span style={{
              background: "rgba(76, 175, 80, 0.9)",
              color: "white",
              borderRadius: 12,
              padding: "4px 8px",
              fontSize: 11,
              fontWeight: 600
            }}>Available</span>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            fontWeight: 700, 
            color: COLORS.white, 
            fontSize: 18, 
            marginBottom: 8,
            lineHeight: 1.3,
            margin: 0
          }}>
            {property.title || property.name || "Rental Unit"}
          </h3>
          
          <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            <span style={{ color: COLORS.gray, fontSize: 14, marginRight: 6 }}>📍</span>
            <span style={{ color: COLORS.silver, fontSize: 14 }}>{property.location || "Location"}</span>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
            <span style={{ color: COLORS.gray, fontSize: 14, marginRight: 6 }}>🛏️</span>
            <span style={{ color: COLORS.silver, fontSize: 14, textTransform: "capitalize" }}>
              {unit.type || "N/A"}
            </span>
          </div>
        </div>
        
        {/* Price Section */}
        <div style={{ 
          borderTop: "1px solid #333",
          paddingTop: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <span style={{ color: COLORS.gray, fontSize: 14 }}>Monthly Rent</span>
          <span style={{ 
            color: COLORS.orange, 
            fontWeight: 700, 
            fontSize: 18
          }}>
            Ksh. {unit.price ? Number(unit.price).toLocaleString() : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RentalListings() {
  const [rentalUnits, setRentalUnits] = useState([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [promotedData, setPromotedData] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const { user, session } = getAuthData();
    if (!user || !session) {
      window.location.href = "/signin";
      return;
    }
    setAuthChecking(false);

    async function loadData() {
      setLoading(true);
      const [rentalRes, unitsRes] = await Promise.all([fetchRentals(), fetchAllUnits()]);
      if (rentalRes.success && Array.isArray(rentalRes.data) && unitsRes.success && Array.isArray(unitsRes.data)) {
        const verifiedProperties = rentalRes.data
          .filter(({ isVerified }) => isVerified === true)
          .map((property) => {
            const images = [];
            if (property.frontImage && typeof property.frontImage === "string" && property.frontImage.trim() !== "") {
              images.push(property.frontImage.trim());
            }
            if (property.backImage && typeof property.backImage === "string" && property.backImage.trim() !== "") {
              images.push(property.backImage.trim());
            }
            return {
              ...property,
              images
            };
          });

        const verifiedPropertyIds = verifiedProperties.map(prop => prop.$id);
        const verifiedUnits = unitsRes.data.filter(unit =>
          verifiedPropertyIds.includes(unit.propertyId)
        );

        const combined = verifiedUnits.map(unit => {
          const parentProperty = verifiedProperties.find(prop => prop.$id === unit.propertyId);
          return {
            ...unit,
            property: parentProperty || {}
          };
        });

        // Promoted
        const promoted = combined.filter(item => item.property?.isPromoted === true);
        const shuffledPromoted = promoted.sort(() => 0.5 - Math.random()).slice(0, 3);

        setRentalUnits(combined);
        setPromotedData(shuffledPromoted);
      } else {
        setRentalUnits([]);
        setPromotedData([]);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Search logic
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    const results = rentalUnits.filter((item) => {
      const matchesQuery =
        searchTerm.trim() === "" ||
        (item.property?.title || item.property?.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (item.type || "").toLowerCase().includes(searchTerm.toLowerCase());
      return matchesQuery;
    });
    setSearchResults(results);
  }, [searchTerm, rentalUnits]);

  // Tag filter
  const filteredUnits = rentalUnits.filter(unit => {
    if (selectedTag === "All") return true;
    if (selectedTag === "Vacant") return unit.vacancyStatus === true;
    if (selectedTag === "Furnished") return unit.isFurnished === true;
    if (selectedTag === "Single room" || selectedTag === "double room") {
      return (unit.type || "").toLowerCase() === selectedTag.toLowerCase();
    }
    return (unit.type || "").replace(/\s/g, "").toLowerCase() === selectedTag.replace(/\s/g, "").toLowerCase();
  });

  if (authChecking) {
    return (
      <div style={{
        color: COLORS.white,
        fontSize: 18,
        minHeight: "100vh",
        background: COLORS.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        Checking authentication...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.background,
      padding: "0 0 32px 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      {/* Navigation */}
      <div style={{
        width: "100%",
        maxWidth: 1200,
        margin: "16px 0 8px 0",
        display: "flex",
        gap: 12,
        justifyContent: "center"
      }}>
        <a
          href="/rentals"
          style={{
            background: COLORS.accent,
            color: "white",
            padding: "10px 20px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14
          }}
        >
          🏠 Rentals
        </a>
        <a
          href="/marketplace"
          style={{
            background: COLORS.secondary,
            color: COLORS.white,
            padding: "10px 20px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
            border: "1px solid #333"
          }}
        >
          🛒 Marketplace
        </a>
      </div>

      {/* Search Bar */}
      <div style={{
        width: "100%",
        maxWidth: 1200,
        margin: "8px 0 8px 0",
        display: "flex",
        alignItems: "center",
        background: COLORS.secondary,
        borderRadius: 10,
        padding: "12px 16px"
      }}>
        <span style={{ color: COLORS.white, fontSize: 18, marginRight: 8 }}>🔍</span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search here..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            fontSize: 15,
            color: COLORS.white,
            background: "transparent",
            border: "none",
            outline: "none"
          }}
        />
        {searchTerm.length > 0 && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSearchResults([]);
              inputRef.current?.focus();
            }}
            style={{
              background: "none",
              border: "none",
              color: COLORS.white,
              fontSize: 18,
              cursor: "pointer",
              marginLeft: 4
            }}
            aria-label="Clear search"
          >✖️</button>
        )}
      </div>

      {/* Tag Filters */}
      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 12,
        flexWrap: "wrap",
        maxWidth: 1200,
        justifyContent: "center"
      }}>
        {["All", "Vacant", "Furnished", "bed sitter", "one bedroom", "two bedroom", "air bnb", "single room", "double room"].map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            style={{
              background: selectedTag === tag ? COLORS.accent : COLORS.secondary,
              color: COLORS.white,
              border: "none",
              borderRadius: 20,
              padding: "6px 14px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Popular Searches */}
      <div style={{ width: "100%", maxWidth: 1200, margin: "8px 0 8px 0" }}>
        <div style={{ color: COLORS.white, fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Popular search</div>
        <div>
          {POPULAR_SEARCHES.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setSearchTerm(item.name);
                inputRef.current?.focus();
              }}
              style={{
                background: COLORS.secondary,
                color: searchTerm === item.name ? COLORS.white : COLORS.silver,
                border: "none",
                borderRadius: 12,
                padding: "6px 12px",
                marginRight: 8,
                marginBottom: 6,
                fontSize: 14,
                cursor: "pointer"
              }}
            >
              ⏳ {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Promotions */}
      <div style={{ width: "100%", maxWidth: 1200, margin: "8px 0 16px 0" }}>
        <div style={{ color: COLORS.white, fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Featured Properties</div>
        {promotedData.length === 0 ? (
          <div style={{
            color: COLORS.gray,
            fontSize: 14,
            background: COLORS.secondary,
            borderRadius: 10,
            padding: 16,
            textAlign: "center"
          }}>
            No featured properties available.
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
            marginBottom: 20
          }}>
            {promotedData.map(unit => (
              <RentalCard key={unit.$id} unit={unit} />
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div style={{
        width: "100%",
        maxWidth: 1200,
        margin: "0 auto"
      }}>
        <div style={{ color: COLORS.white, fontWeight: 600, fontSize: 18, marginBottom: 16 }}>All Properties</div>
        {loading ? (
          <div style={{ color: COLORS.white, fontSize: 18, marginTop: 40, textAlign: "center" }}>Loading rentals...</div>
        ) : (searchTerm.trim() !== "" ? (
          searchResults.length === 0 ? (
            <div style={{ color: COLORS.gray, fontSize: 16, marginTop: 40, textAlign: "center" }}>
              No results found.<br />
              <span style={{ color: COLORS.silver, fontSize: 13 }}>
                Try adjusting your search or filters to find what you're looking for.
              </span>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20
            }}>
              {searchResults.map(unit => (
                <RentalCard key={unit.$id} unit={unit} />
              ))}
            </div>
          )
        ) : (
          filteredUnits.length === 0 ? (
            <div style={{ color: COLORS.gray, fontSize: 16, marginTop: 40, textAlign: "center" }}>
              No rentals found.<br />
              <span style={{ color: COLORS.silver, fontSize: 13 }}>
                Try adjusting your search or filters to find what you're looking for.
              </span>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20
            }}>
              {filteredUnits.map(unit => (
                <RentalCard key={unit.$id} unit={unit} />
              ))}
            </div>
          )
        ))}
      </div>
    </div>
  );
}
