import React, { useState, useEffect } from 'react';
import { createRental } from '../api/rentals';
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

export default function CreateProperty() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    managedBy: '',
    contactPhone: '',
    frontImage: '',
    backImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const { user, session } = getAuthData();
    if (!user || !session) {
      window.location.href = '/signin';
      return;
    }
    setCurrentUser(user);
    setAuthChecking(false);
  }, []);

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
    if (!agreed) {
      alert('Please agree to the rental listing terms');
      return;
    }

    setLoading(true);
    try {
      const result = await createRental({
        ...formData,
        userId: currentUser.$id,
        businessId: 'temp-business-id' // You'll need to implement business creation
      });

      if (result.success) {
        alert('Property created successfully!');
        window.location.href = '/rental-dashboard';
      } else {
        alert('Failed to create property: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating property:', error);
      alert('An error occurred while creating the property');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.frontImage && formData.backImage;
      case 2:
        return formData.title && formData.description && formData.contactPhone && formData.managedBy;
      case 3:
        return formData.latitude && formData.longitude && formData.location;
      default:
        return true;
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
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <h1 style={{ color: COLORS.white, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            List Your Property
          </h1>
          <p style={{ color: COLORS.gray, fontSize: 16 }}>
            Add your rental property to reach more tenants
          </p>
        </div>

        {/* Progress Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          {[1, 2, 3, 4].map(num => (
            <div key={num} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: step >= num ? 18 : 15,
                height: 5,
                background: step >= num ? COLORS.accent : COLORS.gray,
                borderRadius: 2,
                marginRight: num < 4 ? 8 : 0
              }} />
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Images */}
          {step === 1 && (
            <div style={{
              background: COLORS.card,
              borderRadius: 12,
              padding: 24,
              border: '1px solid #333'
            }}>
              <h2 style={{ color: COLORS.white, fontSize: 20, marginBottom: 8 }}>Add Photos</h2>
              <p style={{ color: COLORS.gray, fontSize: 14, marginBottom: 24 }}>
                Add up to 2 photos of your rental property
              </p>

              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                {/* Front Image */}
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    width: '100%',
                    height: 200,
                    border: formData.frontImage ? 'none' : '2px dashed #666',
                    borderRadius: 8,
                    background: formData.frontImage ? 'transparent' : COLORS.secondary,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {formData.frontImage ? (
                      <>
                        <img 
                          src={formData.frontImage} 
                          alt="Front view" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setFormData(prev => ({ ...prev, frontImage: '' }));
                          }}
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: COLORS.gray
                      }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                        <span>Front View</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'frontImage')}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Back Image */}
                <div style={{ flex: 1 }}>
                  <label style={{
                    display: 'block',
                    width: '100%',
                    height: 200,
                    border: formData.backImage ? 'none' : '2px dashed #666',
                    borderRadius: 8,
                    background: formData.backImage ? 'transparent' : COLORS.secondary,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {formData.backImage ? (
                      <>
                        <img 
                          src={formData.backImage} 
                          alt="Back view" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setFormData(prev => ({ ...prev, backImage: '' }));
                          }}
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: COLORS.gray
                      }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                        <span>Back View</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'backImage')}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <p style={{ color: COLORS.gray, fontSize: 12, marginBottom: 24 }}>
                Tip: Include photos of rooms, exterior, and any special features
              </p>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!validateStep(1)}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 6,
                  border: 'none',
                  background: validateStep(1) ? COLORS.accent : COLORS.gray,
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: validateStep(1) ? 'pointer' : 'not-allowed'
                }}
              >
                Next
              </button>
            </div>
          )}

          {/* Step 2: Property Details */}
          {step === 2 && (
            <div style={{
              background: COLORS.card,
              borderRadius: 12,
              padding: 24,
              border: '1px solid #333'
            }}>
              <h2 style={{ color: COLORS.white, fontSize: 20, marginBottom: 8 }}>Property Details</h2>
              <p style={{ color: COLORS.gray, fontSize: 14, marginBottom: 24 }}>
                Tell us about your rental property
              </p>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>
                  Property Name *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Cozy 2-bedroom in Egerton"
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 6,
                    border: '1px solid #444',
                    background: COLORS.secondary,
                    color: COLORS.white,
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your property in details. Include information like bill payments, amenities etc"
                  required
                  rows={4}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 6,
                    border: '1px solid #444',
                    background: COLORS.secondary,
                    color: COLORS.white,
                    fontSize: 14,
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>
                  Phone Number *
                </label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    background: COLORS.secondary,
                    border: '1px solid #444',
                    borderRight: 'none',
                    borderRadius: '6px 0 0 6px',
                    padding: 12,
                    color: COLORS.white
                  }}>
                    +254
                  </span>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 9);
                      setFormData({...formData, contactPhone: value});
                    }}
                    placeholder="712345678"
                    required
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: '0 6px 6px 0',
                      border: '1px solid #444',
                      borderLeft: 'none',
                      background: COLORS.secondary,
                      color: COLORS.white,
                      fontSize: 14
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>
                  Managed By *
                </label>
                <select
                  value={formData.managedBy}
                  onChange={(e) => setFormData({...formData, managedBy: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 6,
                    border: '1px solid #444',
                    background: COLORS.secondary,
                    color: COLORS.white,
                    fontSize: 14
                  }}
                >
                  <option value="">Select who manages this property</option>
                  <option value="Landlord/Landlady">Landlord/Landlady</option>
                  <option value="Agent">Agent</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
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
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!validateStep(2)}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 6,
                    border: 'none',
                    background: validateStep(2) ? COLORS.accent : COLORS.gray,
                    color: 'white',
                    fontSize: 14,
                    cursor: validateStep(2) ? 'pointer' : 'not-allowed'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div style={{
              background: COLORS.card,
              borderRadius: 12,
              padding: 24,
              border: '1px solid #333'
            }}>
              <h2 style={{ color: COLORS.white, fontSize: 20, marginBottom: 8 }}>Location & Details</h2>
              <p style={{ color: COLORS.gray, fontSize: 14, marginBottom: 24 }}>
                Add location information about your property
              </p>

              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>
                    Latitude *
                  </label>
                  <input
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    placeholder="-1.3625416878306622"
                    required
                    style={{
                      width: '100%',
                      padding: 12,
                      borderRadius: 6,
                      border: '1px solid #444',
                      background: COLORS.secondary,
                      color: COLORS.white,
                      fontSize: 14
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>
                    Longitude *
                  </label>
                  <input
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    placeholder="36.65722939768087"
                    required
                    style={{
                      width: '100%',
                      padding: 12,
                      borderRadius: 6,
                      border: '1px solid #444',
                      background: COLORS.secondary,
                      color: COLORS.white,
                      fontSize: 14
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ color: COLORS.silver, display: 'block', marginBottom: 4 }}>
                  Nearby Institution *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 6,
                    border: '1px solid #444',
                    background: COLORS.secondary,
                    color: COLORS.white,
                    fontSize: 14
                  }}
                >
                  <option value="">Select the area your property is located</option>
                  <option value="Egerton">Egerton</option>
                  <option value="JKUAT">JKUAT</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
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
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  disabled={!validateStep(3)}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 6,
                    border: 'none',
                    background: validateStep(3) ? COLORS.accent : COLORS.gray,
                    color: 'white',
                    fontSize: 14,
                    cursor: validateStep(3) ? 'pointer' : 'not-allowed'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <div style={{
              background: COLORS.card,
              borderRadius: 12,
              padding: 24,
              border: '1px solid #333'
            }}>
              <h2 style={{ color: COLORS.white, fontSize: 20, marginBottom: 8 }}>Final Review</h2>
              <p style={{ color: COLORS.gray, fontSize: 14, marginBottom: 24 }}>
                Review and approve your listing before publishing
              </p>

              {/* Property Summary */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ color: COLORS.white, fontSize: 16, marginBottom: 16 }}>Listing Summary</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <span style={{ color: COLORS.silver, fontSize: 14 }}>Title:</span>
                    <p style={{ color: COLORS.white, margin: 0, fontWeight: 600 }}>{formData.title}</p>
                  </div>
                  <div>
                    <span style={{ color: COLORS.silver, fontSize: 14 }}>Location:</span>
                    <p style={{ color: COLORS.white, margin: 0, fontWeight: 600 }}>{formData.location}</p>
                  </div>
                  <div>
                    <span style={{ color: COLORS.silver, fontSize: 14 }}>Managed By:</span>
                    <p style={{ color: COLORS.white, margin: 0, fontWeight: 600 }}>{formData.managedBy}</p>
                  </div>
                  <div>
                    <span style={{ color: COLORS.silver, fontSize: 14 }}>Contact:</span>
                    <p style={{ color: COLORS.white, margin: 0, fontWeight: 600 }}>+254{formData.contactPhone}</p>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <span style={{ color: COLORS.silver, fontSize: 14 }}>Description:</span>
                  <p style={{ color: COLORS.gray, margin: 0, lineHeight: 1.4 }}>{formData.description}</p>
                </div>
              </div>

              {/* Agreement */}
              <div style={{ 
                background: COLORS.secondary,
                borderRadius: 8,
                padding: 16,
                marginBottom: 24
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    style={{ marginTop: 4 }}
                  />
                  <div>
                    <p style={{ color: COLORS.white, margin: 0, marginBottom: 8, fontSize: 14 }}>
                      I agree to the <strong>rental listing terms</strong>
                    </p>
                    <p style={{ color: COLORS.gray, margin: 0, fontSize: 12, lineHeight: 1.4 }}>
                      I confirm that this property listing complies with all rental policies and that the information provided is accurate, truthful, and up to date.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setStep(3)}
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
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !agreed}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 6,
                    border: 'none',
                    background: (loading || !agreed) ? COLORS.gray : COLORS.accent,
                    color: 'white',
                    fontSize: 14,
                    cursor: (loading || !agreed) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Publishing...' : 'Publish Property'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}