import React, { useState, useEffect } from 'react';
import { fetchAllProducts, createProduct, updateProduct, deleteProduct, categories } from '../api/market';
import { getAuthData } from '../api/auth';

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

function ProductCard({ product, onEdit, onDelete }) {
  const image = product.frontImage || product.backImage;
  
  return (
    <div style={{
      background: COLORS.card,
      borderRadius: 12,
      padding: 16,
      border: "1px solid #333",
      marginBottom: 16
    }}>
      <div style={{ display: 'flex', gap: 16 }}>
        {image && (
          <img 
            src={image} 
            alt={product.title}
            style={{
              width: 80,
              height: 80,
              objectFit: 'cover',
              borderRadius: 8
            }}
          />
        )}
        
        <div style={{ flex: 1 }}>
          <h3 style={{ color: COLORS.white, margin: 0, marginBottom: 8, fontSize: 16, fontWeight: 600 }}>
            {product.title}
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ color: COLORS.gray, marginRight: 8 }}>💰</span>
            <span style={{ color: COLORS.accent, fontSize: 16, fontWeight: 600 }}>
              Ksh. {Number(product.price).toLocaleString()}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ color: COLORS.gray, marginRight: 8 }}>📍</span>
            <span style={{ color: COLORS.silver, fontSize: 14 }}>{product.location}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: COLORS.gray, marginRight: 8 }}>🏷️</span>
            <span style={{ color: COLORS.silver, fontSize: 14 }}>{product.category}</span>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          onClick={() => onEdit(product)}
          style={{
            background: 'transparent',
            color: COLORS.accent,
            border: `1px solid ${COLORS.accent}`,
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: 12,
            cursor: 'pointer'
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product.$id)}
          style={{
            background: 'transparent',
            color: COLORS.red,
            border: `1px solid ${COLORS.red}`,
            borderRadius: 6,
            padding: '6px 12px',
            fontSize: 12,
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function CreateProductModal({ isOpen, onClose, onSuccess, editProduct = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    condition: 'Good',
    location: '',
    contactPhone: '',
    frontImage: '',
    backImage: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editProduct) {
      setFormData({
        title: editProduct.title || '',
        description: editProduct.description || '',
        price: editProduct.price || '',
        category: editProduct.category || '',
        subcategory: editProduct.subcategory || '',
        condition: editProduct.condition || 'Good',
        location: editProduct.location || '',
        contactPhone: editProduct.contactPhone || '',
        frontImage: editProduct.frontImage || '',
        backImage: editProduct.backImage || ''
      });
    }
  }, [editProduct]);

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          [type]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { user } = getAuthData();
      const productData = {
        ...formData,
        userId: user.$id,
        businessId: 'temp-business-id'
      };

      let result;
      if (editProduct) {
        result = await updateProduct(editProduct.$id, productData);
      } else {
        result = await createProduct(productData);
      }
      
      if (result.success) {
        onSuccess();
        onClose();
        setFormData({
          title: '',
          description: '',
          price: '',
          category: '',
          subcategory: '',
          condition: 'Good',
          location: '',
          contactPhone: '',
          frontImage: '',
          backImage: ''
        });
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedCategory = categories.find(cat => cat.name === formData.category);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: COLORS.card,
        borderRadius: 12,
        padding: 24,
        width: '90%',
        maxWidth: 600,
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h3 style={{ color: COLORS.white, marginBottom: 20 }}>
          {editProduct ? 'Edit Product' : 'Create New Product'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 6,
                border: '1px solid #444',
                background: COLORS.secondary,
                color: COLORS.white,
                fontSize: 14
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 6,
                border: '1px solid #444',
                background: COLORS.secondary,
                color: COLORS.white,
                fontSize: 14,
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Price (Ksh)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid #444',
                  background: COLORS.secondary,
                  color: COLORS.white,
                  fontSize: 14
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({...formData, condition: e.target.value})}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid #444',
                  background: COLORS.secondary,
                  color: COLORS.white,
                  fontSize: 14
                }}
              >
                {['New', 'Like New', 'Good', 'Fair', 'Poor'].map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value, subcategory: ''})}
                required
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid #444',
                  background: COLORS.secondary,
                  color: COLORS.white,
                  fontSize: 14
                }}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Subcategory</label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                disabled={!selectedCategory}
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid #444',
                  background: COLORS.secondary,
                  color: COLORS.white,
                  fontSize: 14
                }}
              >
                <option value="">Select Subcategory</option>
                {selectedCategory?.subcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Location</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid #444',
                  background: COLORS.secondary,
                  color: COLORS.white,
                  fontSize: 14
                }}
              >
                <option value="">Select Location</option>
                <option value="Egerton">Egerton</option>
                <option value="JKUAT">JKUAT</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Contact Phone</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                placeholder="712345678"
                style={{
                  width: '100%',
                  padding: 10,
                  borderRadius: 6,
                  border: '1px solid #444',
                  background: COLORS.secondary,
                  color: COLORS.white,
                  fontSize: 14
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Front Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'frontImage')}
                style={{ display: 'none' }}
                id="frontImage"
              />
              <label
                htmlFor="frontImage"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 100,
                  border: '2px dashed #666',
                  borderRadius: 8,
                  background: formData.frontImage ? 'transparent' : COLORS.secondary,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {formData.frontImage ? (
                  <img 
                    src={formData.frontImage} 
                    alt="Front" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: COLORS.gray,
                    fontSize: 12
                  }}>
                    Click to upload
                  </div>
                )}
              </label>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Back Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'backImage')}
                style={{ display: 'none' }}
                id="backImage"
              />
              <label
                htmlFor="backImage"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 100,
                  border: '2px dashed #666',
                  borderRadius: 8,
                  background: formData.backImage ? 'transparent' : COLORS.secondary,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {formData.backImage ? (
                  <img 
                    src={formData.backImage} 
                    alt="Back" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: COLORS.gray,
                    fontSize: 12
                  }}>
                    Click to upload
                  </div>
                )}
              </label>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 6,
                border: `1px solid ${COLORS.accent}`,
                background: 'transparent',
                color: COLORS.accent,
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 6,
                border: 'none',
                background: COLORS.accent,
                color: 'white',
                fontSize: 14,
                cursor: 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Saving...' : (editProduct ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MarketplaceDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const { user, session } = getAuthData();
    if (!user || !session) {
      window.location.href = '/signin';
      return;
    }
    setAuthChecking(false);
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await fetchAllProducts();
      if (result.success) {
        // Filter products by current user (you might need to add userId to the query)
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const result = await deleteProduct(productId);
        if (result.success) {
          loadProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowCreateModal(true);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditingProduct(null);
  };

  if (authChecking) {
    return (
      <div style={{
        minHeight: '100vh',
        background: COLORS.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: COLORS.white
      }}>
        Checking authentication...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.background,
      padding: 20
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ color: COLORS.white, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            Marketplace Dashboard
          </h1>
          <p style={{ color: COLORS.gray, fontSize: 16 }}>
            Manage your marketplace products
          </p>
        </div>

        {/* Navigation */}
        <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
          <a
            href="/marketplace"
            style={{
              background: COLORS.secondary,
              color: COLORS.white,
              padding: '10px 20px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14,
              border: '1px solid #333'
            }}
          >
            🛒 View Marketplace
          </a>
          <a
            href="/rentals"
            style={{
              background: COLORS.secondary,
              color: COLORS.white,
              padding: '10px 20px',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14,
              border: '1px solid #333'
            }}
          >
            🏠 Rentals
          </a>
        </div>

        {/* Products List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ color: COLORS.white, fontSize: 20, fontWeight: 600, margin: 0 }}>
              My Products ({products.length})
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                background: COLORS.accent,
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              + Add Product
            </button>
          </div>

          {loading ? (
            <div style={{ color: COLORS.white, textAlign: 'center', padding: 40 }}>
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div style={{
              background: COLORS.card,
              borderRadius: 12,
              padding: 40,
              textAlign: 'center',
              border: '1px solid #333'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
              <h3 style={{ color: COLORS.white, marginBottom: 8 }}>No Products Yet</h3>
              <p style={{ color: COLORS.gray, marginBottom: 20 }}>
                Start by adding your first product to the marketplace
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                style={{
                  background: COLORS.accent,
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Add Product
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: 20
            }}>
              {products.map(product => (
                <ProductCard
                  key={product.$id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateProductModal
        isOpen={showCreateModal}
        onClose={handleModalClose}
        onSuccess={loadProducts}
        editProduct={editingProduct}
      />
    </div>
  );
}