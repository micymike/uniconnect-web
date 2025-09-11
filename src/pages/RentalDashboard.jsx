import React, { useState, useEffect } from 'react';
import { fetchRentals, getUnitsForProperty, createRental, createUnit, updateUnit, deleteUnit, deleteProperty } from '../api/rentals';
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

function PropertyCard({ property, onViewUnits, onDelete }) {
  const images = property.images ? JSON.parse(property.images) : [];
  
  return (
    <div style={{
      background: COLORS.card,
      borderRadius: 12,
      padding: 16,
      border: "1px solid #333",
      marginBottom: 16
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: COLORS.white, margin: 0, marginBottom: 8, fontSize: 18, fontWeight: 600 }}>
            {property.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ color: COLORS.gray, marginRight: 8 }}>📍</span>
            <span style={{ color: COLORS.silver, fontSize: 14 }}>{property.location}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ color: COLORS.gray, marginRight: 8 }}>👤</span>
            <span style={{ color: COLORS.silver, fontSize: 14 }}>Managed by: {property.managedBy}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: COLORS.gray, marginRight: 8 }}>📞</span>
            <span style={{ color: COLORS.silver, fontSize: 14 }}>+254{property.contactPhone}</span>
          </div>
        </div>
        
        {images.length > 0 && (
          <img 
            src={images[0]} 
            alt="Property" 
            style={{
              width: 80,
              height: 80,
              objectFit: 'cover',
              borderRadius: 8,
              marginLeft: 16
            }}
          />
        )}
      </div>
      
      <p style={{ color: COLORS.gray, fontSize: 14, marginBottom: 16, lineHeight: 1.4 }}>
        {property.description}
      </p>
      
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={() => onViewUnits(property.$id)}
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
          View Units
        </button>
        <button
          onClick={() => onDelete(property.$id)}
          style={{
            background: COLORS.red,
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Delete Property
        </button>
      </div>
    </div>
  );
}

function UnitCard({ unit, onEdit, onDelete }) {
  const amenities = unit.amenities ? JSON.parse(unit.amenities) : [];
  
  return (
    <div style={{
      background: COLORS.secondary,
      borderRadius: 8,
      padding: 16,
      border: "1px solid #444",
      marginBottom: 12
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <h4 style={{ color: COLORS.white, margin: 0, marginBottom: 8, fontSize: 16, fontWeight: 600 }}>
            {unit.type}
          </h4>
          <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
            <span style={{ color: COLORS.silver, fontSize: 14 }}>🛏️ {unit.noOfBedrooms} bed(s)</span>
            <span style={{ color: COLORS.silver, fontSize: 14 }}>🚿 {unit.noOfBathrooms} bath(s)</span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
            <span style={{ color: COLORS.accent, fontSize: 16, fontWeight: 600 }}>
              Ksh. {Number(unit.price).toLocaleString()}/month
            </span>
            <span style={{ color: COLORS.gray, fontSize: 14 }}>
              Deposit: Ksh. {Number(unit.deposit).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 4 }}>
          {unit.vacancyStatus && (
            <span style={{
              background: COLORS.green,
              color: 'white',
              borderRadius: 12,
              padding: '4px 8px',
              fontSize: 11,
              fontWeight: 600
            }}>Available</span>
          )}
          {unit.isFurnished && (
            <span style={{
              background: COLORS.accent,
              color: 'white',
              borderRadius: 12,
              padding: '4px 8px',
              fontSize: 11,
              fontWeight: 600
            }}>Furnished</span>
          )}
        </div>
      </div>
      
      {amenities.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <span style={{ color: COLORS.gray, fontSize: 14 }}>Amenities: </span>
          <span style={{ color: COLORS.silver, fontSize: 14 }}>{amenities.join(', ')}</span>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => onEdit(unit)}
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
          onClick={() => onDelete(unit.$id)}
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

function CreateUnitModal({ isOpen, onClose, propertyId, onSuccess }) {
  const [formData, setFormData] = useState({
    unitType: '',
    noOfBedrooms: '',
    noOfBathrooms: '',
    rent: '',
    deposit: '',
    isVacant: true,
    isFurnished: false,
    amenities: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const amenitiesArray = formData.amenities.split(',').map(item => item.trim()).filter(Boolean);
      
      const result = await createUnit({
        propertyId,
        unitType: formData.unitType,
        noOfBedrooms: parseInt(formData.noOfBedrooms),
        noOfBathrooms: parseInt(formData.noOfBathrooms),
        rent: parseInt(formData.rent),
        deposit: parseInt(formData.deposit),
        isVacant: formData.isVacant,
        isFurnished: formData.isFurnished,
        amenities: JSON.stringify(amenitiesArray)
      });
      
      if (result.success) {
        onSuccess();
        onClose();
        setFormData({
          unitType: '',
          noOfBedrooms: '',
          noOfBathrooms: '',
          rent: '',
          deposit: '',
          isVacant: true,
          isFurnished: false,
          amenities: ''
        });
      }
    } catch (error) {
      console.error('Error creating unit:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
        maxWidth: 500,
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h3 style={{ color: COLORS.white, marginBottom: 20 }}>Create New Unit</h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Unit Type</label>
            <input
              type="text"
              value={formData.unitType}
              onChange={(e) => setFormData({...formData, unitType: e.target.value})}
              placeholder="e.g., One bedroom"
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
          
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Bedrooms</label>
              <input
                type="number"
                value={formData.noOfBedrooms}
                onChange={(e) => setFormData({...formData, noOfBedrooms: e.target.value})}
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
              <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Bathrooms</label>
              <input
                type="number"
                value={formData.noOfBathrooms}
                onChange={(e) => setFormData({...formData, noOfBathrooms: e.target.value})}
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
          </div>
          
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Monthly Rent (Ksh)</label>
              <input
                type="number"
                value={formData.rent}
                onChange={(e) => setFormData({...formData, rent: e.target.value})}
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
              <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Deposit (Ksh)</label>
              <input
                type="number"
                value={formData.deposit}
                onChange={(e) => setFormData({...formData, deposit: e.target.value})}
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
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>Amenities (comma separated)</label>
            <input
              type="text"
              value={formData.amenities}
              onChange={(e) => setFormData({...formData, amenities: e.target.value})}
              placeholder="e.g., Free electricity, WiFi, Parking"
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
          
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', color: COLORS.silver }}>
              <input
                type="checkbox"
                checked={formData.isVacant}
                onChange={(e) => setFormData({...formData, isVacant: e.target.checked})}
                style={{ marginRight: 8 }}
              />
              Available
            </label>
            <label style={{ display: 'flex', alignItems: 'center', color: COLORS.silver }}>
              <input
                type="checkbox"
                checked={formData.isFurnished}
                onChange={(e) => setFormData({...formData, isFurnished: e.target.checked})}
                style={{ marginRight: 8 }}
              />
              Furnished
            </label>
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
              {loading ? 'Creating...' : 'Create Unit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RentalDashboard() {
  const [properties, setProperties] = useState([]);
  const [selectedPropertyUnits, setSelectedPropertyUnits] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateUnit, setShowCreateUnit] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const { user, session } = getAuthData();
    if (!user || !session) {
      window.location.href = '/signin';
      return;
    }
    setAuthChecking(false);
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const result = await fetchRentals();
      if (result.success) {
        // Filter properties by current user (you might need to add userId to the query)
        setProperties(result.data);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnitsForProperty = async (propertyId) => {
    try {
      const result = await getUnitsForProperty(propertyId);
      if (result.success) {
        setSelectedPropertyUnits(result.result);
        setSelectedPropertyId(propertyId);
      }
    } catch (error) {
      console.error('Error loading units:', error);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property and all its units?')) {
      try {
        const result = await deleteProperty(propertyId);
        if (result.success) {
          loadProperties();
          if (selectedPropertyId === propertyId) {
            setSelectedPropertyUnits([]);
            setSelectedPropertyId(null);
          }
        }
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  const handleDeleteUnit = async (unitId) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      try {
        const result = await deleteUnit(unitId);
        if (result.success) {
          if (selectedPropertyId) {
            loadUnitsForProperty(selectedPropertyId);
          }
        }
      } catch (error) {
        console.error('Error deleting unit:', error);
      }
    }
  };

  const handleCreateUnitSuccess = () => {
    if (selectedPropertyId) {
      loadUnitsForProperty(selectedPropertyId);
    }
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
            Rental Dashboard
          </h1>
          <p style={{ color: COLORS.gray, fontSize: 16 }}>
            Manage your rental properties and units
          </p>
        </div>

        {/* Navigation */}
        <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
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
            🏠 View Rentals
          </a>
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
            🛒 Marketplace
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selectedPropertyId ? '1fr 1fr' : '1fr', gap: 24 }}>
          {/* Properties List */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ color: COLORS.white, fontSize: 20, fontWeight: 600, margin: 0 }}>
                My Properties ({properties.length})
              </h2>
              <button
                onClick={() => window.location.href = '/create-property'}
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
                + Add Property
              </button>
            </div>

            {loading ? (
              <div style={{ color: COLORS.white, textAlign: 'center', padding: 40 }}>
                Loading properties...
              </div>
            ) : properties.length === 0 ? (
              <div style={{
                background: COLORS.card,
                borderRadius: 12,
                padding: 40,
                textAlign: 'center',
                border: '1px solid #333'
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
                <h3 style={{ color: COLORS.white, marginBottom: 8 }}>No Properties Yet</h3>
                <p style={{ color: COLORS.gray, marginBottom: 20 }}>
                  Start by adding your first rental property
                </p>
                <button
                  onClick={() => window.location.href = '/create-property'}
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
                  Add Property
                </button>
              </div>
            ) : (
              properties.map(property => (
                <PropertyCard
                  key={property.$id}
                  property={property}
                  onViewUnits={loadUnitsForProperty}
                  onDelete={handleDeleteProperty}
                />
              ))
            )}
          </div>

          {/* Units List */}
          {selectedPropertyId && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ color: COLORS.white, fontSize: 20, fontWeight: 600, margin: 0 }}>
                  Units ({selectedPropertyUnits.length})
                </h2>
                <button
                  onClick={() => setShowCreateUnit(true)}
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
                  + Add Unit
                </button>
              </div>

              {selectedPropertyUnits.length === 0 ? (
                <div style={{
                  background: COLORS.card,
                  borderRadius: 12,
                  padding: 40,
                  textAlign: 'center',
                  border: '1px solid #333'
                }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
                  <h3 style={{ color: COLORS.white, marginBottom: 8 }}>No Units Yet</h3>
                  <p style={{ color: COLORS.gray, marginBottom: 20 }}>
                    Add units to this property to start renting
                  </p>
                  <button
                    onClick={() => setShowCreateUnit(true)}
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
                    Add Unit
                  </button>
                </div>
              ) : (
                selectedPropertyUnits.map(unit => (
                  <UnitCard
                    key={unit.$id}
                    unit={unit}
                    onEdit={(unit) => console.log('Edit unit:', unit)}
                    onDelete={handleDeleteUnit}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <CreateUnitModal
        isOpen={showCreateUnit}
        onClose={() => setShowCreateUnit(false)}
        propertyId={selectedPropertyId}
        onSuccess={handleCreateUnitSuccess}
      />
    </div>
  );
}