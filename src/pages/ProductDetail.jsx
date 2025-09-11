import React, { useState, useEffect } from 'react';
import { getProductById } from '../api/market';

const COLORS = {
  background: "#000",
  card: "#181818",
  secondary: "#232526",
  accent: "#ff8c00",
  white: "#fff",
  gray: "#aaa",
  silver: "#ccc",
  green: "#4caf50",
  red: "#f44336"
};

export default function ProductDetail({ productId, isOpen, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen && productId) {
      loadProductDetails();
    }
  }, [isOpen, productId]);

  const loadProductDetails = async () => {
    setLoading(true);
    try {
      const result = await getProductById(productId);
      if (result.success) {
        setProduct(result.result);
      }
    } catch (error) {
      console.error('Error loading product details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const images = [];
  if (product?.frontImage) images.push(product.frontImage);
  if (product?.backImage) images.push(product.backImage);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20
    }}>
      <div style={{
        background: COLORS.card,
        borderRadius: 16,
        width: '100%',
        maxWidth: 800,
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: 40,
            height: 40,
            cursor: 'pointer',
            fontSize: 18,
            zIndex: 10
          }}
        >
          ✕
        </button>

        {loading ? (
          <div style={{
            padding: 40,
            textAlign: 'center',
            color: COLORS.white
          }}>
            Loading product details...
          </div>
        ) : product ? (
          <>
            {/* Image Gallery */}
            {images.length > 0 && (
              <div style={{ position: 'relative', height: 300, overflow: 'hidden' }}>
                <img
                  src={images[currentImageIndex]}
                  alt="Product"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === 0 ? images.length - 1 : prev - 1
                      )}
                      style={{
                        position: 'absolute',
                        left: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        cursor: 'pointer',
                        fontSize: 18
                      }}
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === images.length - 1 ? 0 : prev + 1
                      )}
                      style={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        cursor: 'pointer',
                        fontSize: 18
                      }}
                    >
                      ›
                    </button>
                    
                    {/* Image Indicators */}
                    <div style={{
                      position: 'absolute',
                      bottom: 16,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: 8
                    }}>
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            border: 'none',
                            background: index === currentImageIndex ? COLORS.accent : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer'
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Content */}
            <div style={{ padding: 24 }}>
              {/* Header */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h2 style={{ 
                    color: COLORS.white, 
                    fontSize: 24, 
                    fontWeight: 700, 
                    margin: 0,
                    flex: 1
                  }}>
                    {product.title}
                  </h2>
                  
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {product.isAvailable && (
                      <span style={{
                        background: COLORS.green,
                        color: 'white',
                        borderRadius: 12,
                        padding: '4px 12px',
                        fontSize: 12,
                        fontWeight: 600
                      }}>Available</span>
                    )}
                    <span style={{
                      background: COLORS.secondary,
                      color: COLORS.silver,
                      borderRadius: 12,
                      padding: '4px 12px',
                      fontSize: 12,
                      fontWeight: 600
                    }}>{product.condition}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ color: COLORS.gray, marginRight: 8 }}>📍</span>
                  <span style={{ color: COLORS.silver, fontSize: 16 }}>{product.location}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ color: COLORS.gray, marginRight: 8 }}>🏷️</span>
                  <span style={{ color: COLORS.silver, fontSize: 16 }}>
                    {product.category} {product.subcategory && `> ${product.subcategory}`}
                  </span>
                </div>

                {/* Price */}
                <div style={{
                  background: COLORS.secondary,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 24
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ color: COLORS.gray, fontSize: 14 }}>Price</span>
                      <div style={{ 
                        color: COLORS.accent, 
                        fontWeight: 700, 
                        fontSize: 28
                      }}>
                        Ksh. {product.price ? Number(product.price).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ color: COLORS.white, fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
                    Description
                  </h3>
                  <p style={{ 
                    color: COLORS.silver, 
                    lineHeight: 1.6,
                    background: COLORS.secondary,
                    padding: 16,
                    borderRadius: 8
                  }}>
                    {product.description}
                  </p>
                </div>
              )}

              {/* Product Details */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: 16, 
                marginBottom: 24 
              }}>
                <div style={{
                  background: COLORS.secondary,
                  borderRadius: 8,
                  padding: 16,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🏷️</div>
                  <div style={{ color: COLORS.white, fontWeight: 600, marginBottom: 4 }}>
                    {product.category}
                  </div>
                  <div style={{ color: COLORS.gray, fontSize: 14 }}>Category</div>
                </div>

                {product.subcategory && (
                  <div style={{
                    background: COLORS.secondary,
                    borderRadius: 8,
                    padding: 16,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>📂</div>
                    <div style={{ color: COLORS.white, fontWeight: 600, marginBottom: 4 }}>
                      {product.subcategory}
                    </div>
                    <div style={{ color: COLORS.gray, fontSize: 14 }}>Subcategory</div>
                  </div>
                )}

                <div style={{
                  background: COLORS.secondary,
                  borderRadius: 8,
                  padding: 16,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>⭐</div>
                  <div style={{ color: COLORS.white, fontWeight: 600, marginBottom: 4 }}>
                    {product.condition}
                  </div>
                  <div style={{ color: COLORS.gray, fontSize: 14 }}>Condition</div>
                </div>

                <div style={{
                  background: COLORS.secondary,
                  borderRadius: 8,
                  padding: 16,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>
                    {product.isAvailable ? '✅' : '❌'}
                  </div>
                  <div style={{ color: COLORS.white, fontWeight: 600, marginBottom: 4 }}>
                    {product.isAvailable ? 'Available' : 'Sold'}
                  </div>
                  <div style={{ color: COLORS.gray, fontSize: 14 }}>Status</div>
                </div>
              </div>

              {/* Contact Information */}
              <div style={{
                background: COLORS.secondary,
                borderRadius: 12,
                padding: 20,
                marginBottom: 24
              }}>
                <h3 style={{ color: COLORS.white, fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
                  Contact Seller
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ color: COLORS.gray, marginRight: 12, fontSize: 18 }}>📞</span>
                  <div>
                    <div style={{ color: COLORS.gray, fontSize: 14 }}>Phone</div>
                    <div style={{ color: COLORS.white, fontWeight: 600 }}>
                      +254{product.contactPhone || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    if (product.contactPhone) {
                      window.open(`tel:+254${product.contactPhone}`, '_self');
                    }
                  }}
                  style={{
                    flex: 1,
                    minWidth: 120,
                    background: COLORS.accent,
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 20px',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  📞 Call Seller
                </button>
                
                <button
                  onClick={() => {
                    if (product.contactPhone) {
                      const message = `Hi, I'm interested in your ${product.title}. Is it still available?`;
                      window.open(`https://wa.me/254${product.contactPhone}?text=${encodeURIComponent(message)}`, '_blank');
                    }
                  }}
                  style={{
                    flex: 1,
                    minWidth: 120,
                    background: '#25D366',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 20px',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  💬 WhatsApp
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            padding: 40,
            textAlign: 'center',
            color: COLORS.white
          }}>
            Product not found
          </div>
        )}
      </div>
    </div>
  );
}