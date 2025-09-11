import React, { useEffect, useState, useRef } from "react";
import { getAuthData } from "../api/auth";
import { fetchAllProducts } from "../api/market";
import { categories } from "../api/marketCategories";
import ProductDetail from "./ProductDetail";

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

function ProductCard({ product, onClick }) {
  // Use frontImage, backImage, or image
  const image =
    product.frontImage ||
    product.backImage ||
    product.image ||
    null;

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
        flexDirection: "column",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Image Section */}
      <div
        style={{
          width: "100%",
          height: 200,
          overflow: "hidden",
          background: COLORS.secondary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {image ? (
          <img
            src={image}
            alt={product.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              color: COLORS.gray,
              fontSize: 48,
            }}
          >
            🛒
          </div>
        )}
        {/* Status Badges */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            gap: 6,
          }}
        >
          {product.isAvailable && (
            <span
              style={{
                background: "rgba(76, 175, 80, 0.9)",
                color: "white",
                borderRadius: 12,
                padding: "4px 8px",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              Available
            </span>
          )}
          {product.condition && (
            <span
              style={{
                background: "rgba(255, 140, 0, 0.9)",
                color: "white",
                borderRadius: 12,
                padding: "4px 8px",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {product.condition}
            </span>
          )}
        </div>
      </div>
      {/* Content Section */}
      <div
        style={{
          padding: 16,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontWeight: 700,
              color: COLORS.white,
              fontSize: 18,
              marginBottom: 8,
              lineHeight: 1.3,
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {product.title}
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                color: COLORS.gray,
                fontSize: 14,
                marginRight: 6,
              }}
            >
              📍
            </span>
            <span style={{ color: COLORS.silver, fontSize: 14 }}>
              {product.location || "Location"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                color: COLORS.gray,
                fontSize: 14,
                marginRight: 6,
              }}
            >
              🏷️
            </span>
            <span
              style={{
                color: COLORS.silver,
                fontSize: 14,
                textTransform: "capitalize",
              }}
            >
              {product.subcategory || product.category || "Other"}
            </span>
          </div>
        </div>
        {/* Price Section */}
        <div
          style={{
            borderTop: "1px solid #333",
            paddingTop: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: COLORS.gray, fontSize: 14 }}>Price</span>
          <span
            style={{
              color: COLORS.orange,
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            Ksh. {product.price ? Number(product.price).toLocaleString() : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function StudentMarketplace() {
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const { user, session } = getAuthData();
    if (!user || !session) {
      window.location.href = "/signin";
      return;
    }
    setLoading(true);
    async function loadData() {
      const productRes = await fetchAllProducts();
      if (productRes.success) {
        const availableProducts = productRes.data.filter(
          (product) => product.isAvailable === true
        );
        const unavailableProducts = productRes.data.filter(
          (product) => product.isAvailable !== true
        );
        const shuffledAvailable = [...availableProducts].sort(
          () => Math.random() - 0.5
        );
        const shuffledUnavailable = [...unavailableProducts].sort(
          () => Math.random() - 0.5
        );
        const finalProducts = [...shuffledAvailable, ...shuffledUnavailable];
        setAllProducts(finalProducts);
      } else {
        setAllProducts([]);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Category and subcategory logic
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "All") {
      const found = categories.find(
        (category) => category.name === selectedCategory
      );
      setSubcategories(found?.subcategories || []);
    } else {
      setSubcategories([]);
    }
    setSelectedSubCategory("");
    setSearchQuery("");
    setSearchResults([]);
  }, [selectedCategory]);

  // Search logic
  useEffect(() => {
    if (searchQuery.trim() === "" && !selectedSubCategory) {
      setSearchResults([]);
      return;
    }
    const results = allProducts.filter((item) => {
      const matchesQuery =
        searchQuery.trim() === "" ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subcategory?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory ||
        selectedCategory === "All" ||
        item.category === selectedCategory;
      const matchesSubCategory =
        !selectedSubCategory || item.subcategory === selectedSubCategory;
      return matchesQuery && matchesCategory && matchesSubCategory;
    });
    setSearchResults(results);
  }, [searchQuery, allProducts, selectedCategory, selectedSubCategory]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.background,
        padding: "0 0 32px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Navigation */}
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "16px 0 8px 0",
          display: "flex",
          gap: 12,
          justifyContent: "center",
        }}
      >
        <a
          href="/rentals"
          style={{
            background: COLORS.secondary,
            color: COLORS.white,
            padding: "10px 20px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
            border: "1px solid #333",
          }}
        >
          🏠 Rentals
        </a>
        <a
          href="/marketplace"
          style={{
            background: COLORS.accent,
            color: "white",
            padding: "10px 20px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          🛒 Marketplace
        </a>
        <a
          href="/marketplace-dashboard"
          style={{
            background: COLORS.secondary,
            color: COLORS.white,
            padding: "10px 20px",
            borderRadius: 8,
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 14,
            border: "1px solid #333",
          }}
        >
          📊 My Products
        </a>
      </div>

      {/* Search Bar */}
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "8px 0 8px 0",
          display: "flex",
          alignItems: "center",
          background: COLORS.secondary,
          borderRadius: 10,
          padding: "12px 16px",
        }}
      >
        <span style={{ color: COLORS.white, fontSize: 18, marginRight: 8 }}>
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            fontSize: 15,
            color: COLORS.white,
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />
        {searchQuery.length > 0 && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSearchResults([]);
              inputRef.current?.focus();
            }}
            style={{
              background: "none",
              border: "none",
              color: COLORS.white,
              fontSize: 18,
              cursor: "pointer",
              marginLeft: 4,
            }}
            aria-label="Clear search"
          >
            ✖️
          </button>
        )}
      </div>

      {/* Category Tags */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 12,
          flexWrap: "wrap",
          maxWidth: 1200,
          justifyContent: "center",
        }}
      >
        <button
          key="All"
          onClick={() => setSelectedCategory("All")}
          style={{
            background:
              selectedCategory === "All" ? COLORS.accent : COLORS.secondary,
            color: COLORS.white,
            border: "none",
            borderRadius: 20,
            padding: "6px 14px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            style={{
              background:
                selectedCategory === cat.name
                  ? COLORS.accent
                  : COLORS.secondary,
              color: COLORS.white,
              border: "none",
              borderRadius: 20,
              padding: "6px 14px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Subcategory Tags */}
      {subcategories.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 12,
            flexWrap: "wrap",
            maxWidth: 1200,
            justifyContent: "center",
          }}
        >
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubCategory(sub)}
              style={{
                background:
                  selectedSubCategory === sub
                    ? COLORS.accent
                    : COLORS.secondary,
                color: COLORS.white,
                border: "none",
                borderRadius: 20,
                padding: "6px 14px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Section Header */}
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "8px 0 16px 0",
          color: COLORS.white,
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        All Products
      </div>

      {/* Results */}
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {loading ? (
          <div
            style={{
              color: COLORS.white,
              fontSize: 18,
              marginTop: 40,
              textAlign: "center",
            }}
          >
            Loading products...
          </div>
        ) : searchQuery.trim() !== "" ||
          (selectedCategory && selectedCategory !== "All") ||
          selectedSubCategory ? (
          searchResults.length === 0 ? (
            <div
              style={{
                color: COLORS.gray,
                fontSize: 16,
                marginTop: 40,
                textAlign: "center",
              }}
            >
              No results found.
              <br />
              <span style={{ color: COLORS.silver, fontSize: 13 }}>
                Try adjusting your search or filters to find what you're looking
                for.
              </span>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 20,
              }}
            >
              {searchResults.map((product) => (
                <ProductCard 
                  key={product.$id} 
                  product={product} 
                  onClick={() => {
                    setSelectedProductId(product.$id);
                    setShowProductDetail(true);
                  }}
                />
              ))}
            </div>
          )
        ) : allProducts.length === 0 ? (
          <div
            style={{
              color: COLORS.gray,
              fontSize: 16,
              marginTop: 40,
              textAlign: "center",
            }}
          >
            No products found.
            <br />
            <span style={{ color: COLORS.silver, fontSize: 13 }}>
              Try adjusting your search or filters to find what you're looking
              for.
            </span>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {allProducts.map((product) => (
              <ProductCard 
                key={product.$id} 
                product={product} 
                onClick={() => {
                  setSelectedProductId(product.$id);
                  setShowProductDetail(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <ProductDetail
        productId={selectedProductId}
        isOpen={showProductDetail}
        onClose={() => {
          setShowProductDetail(false);
          setSelectedProductId(null);
        }}
      />
    </div>
  );
}
