import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Gray, Primary, white } from '../utils/colors';
import { getCurrentUser } from '../lib/auth/emailpassword';
import { getBusinessByUserId } from '../lib/business/business';
import Avatar from './avatar';

const BusinessCard = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [showMore, setShowMore] = useState(false);


  useEffect(() => {
    const fetchBusiness = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const userRes = await getCurrentUser();
        if (!userRes.success || !userRes.user?.$id) {
          setFetchError('Could not get current user.');
          setLoading(false);
          return;
        }
        const userId = userRes.user.$id;
        const businessRes = await getBusinessByUserId(userId);
        if (businessRes.success && businessRes.business) {
          setBusiness(businessRes.business);
        } else {
          setFetchError(businessRes.message || 'No business found for this user.');
        }
      } catch (err) {
        setFetchError('Failed to fetch business.');
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, []);

  if (loading) {
    return (
      <View style={[styles.cardContent, { alignItems: 'center', justifyContent: 'center', minHeight: 80 }]}>
        <ActivityIndicator size="small" color="#4cc9f0" />
        <Text style={{ color: Gray, marginTop: 8 }}>Loading business info...</Text>
      </View>
    );
  }

  if (fetchError) {
    return (
      <View style={[styles.cardContent, { alignItems: 'center', justifyContent: 'center', minHeight: 80 }]}>
        <Text style={{ color: 'red' }}>{fetchError}</Text>
      </View>
    );
  }

  if (!business) {
    return (
      <View style={[styles.cardContent, { alignItems: 'center', justifyContent: 'center', minHeight: 80 }]}>
        <Text style={{ color: Gray }}>No business data available.</Text>
      </View>
    );
  }

  const getServiceArray = (type) => {
    if (!type) return [];
    if (Array.isArray(type)) return type;
    if (typeof type === "string") {
      try {
        const parsed = JSON.parse(type);
        if (Array.isArray(parsed)) return parsed;
        return [parsed];
      } catch {
        return [type];
      }
    }
    return [];
  };

  const services = getServiceArray(business.type);

  return (
    <View style={styles.cardContent}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <View style={{flexDirection: "row",alignItems:"center"}}>
            <Avatar name={business?.name} size={40} style={{marginRight: 12}}/>
            <Text numberOfLines={1} style={styles.businessName}>{business.name || "Business"}</Text>
          </View>
        </View>
      </View>
      
      <Text numberOfLines={showMore ? undefined : 2} style={styles.description}>
        {business.about || "No business description provided."}
      </Text>
      <View style={styles.tagsContainer}>
        {services.map((service, idx) => (
          <View style={styles.tag} key={idx}>
            {service === "rental" && <FontAwesome name="building" size={12} color="#fff" style={{ marginRight: 4 }} />}
            {service === "market" && <FontAwesome name="shopping-cart" size={12} color="#fff" style={{ marginRight: 4 }} />}
            <Text style={styles.tagText}>{service}</Text>
          </View>
        ))}
      </View>
      <View style={styles.contactInfo}>
        {showMore && (
          <>
        {business.phone && (
          <View style={styles.contactItem}>
            <FontAwesome name="phone" size={14} color={Primary} style={styles.icon} />
            <Text style={styles.contactText}>{business.phone}</Text>
          </View>
        )}
        {business.email && (
          <View style={styles.contactItem}>
            <FontAwesome name="envelope" size={14} color={Primary} style={styles.icon} />
            <Text style={styles.contactText}>{business.email}</Text>
          </View>
        )}
        {business.website && (
          <View style={styles.contactItem}>
            <FontAwesome name="globe" size={14} color={Primary} style={styles.icon} />
            <Text style={styles.contactText}>{business.website}</Text>
          </View>
        )}
        {business.location && (
          <View style={styles.contactItem}>
            <FontAwesome name="map-marker" size={14} color={Primary} style={styles.icon} />
            <Text style={styles.contactText}>{business.location}</Text>
          </View>
        )}
        </>
      )}
      <Text
       onPress={() => setShowMore(!showMore)}
       style={{color: Primary,fontWeight: 'bold',marginBottom: 6,alignSelf: 'flex-end',}}
      >
    {showMore ? 'Show Less' : 'Show More'}
  </Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    marginHorizontal: 16,
  },
  cardContent: {
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: "space-between"
  },
  businessName: {
    fontSize: 20,
    fontWeight: 600,
    color: '#fff',
    marginRight: 8,
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a1205', 
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 7,
    width: 70,
    marginVertical: 2
  },
  verifiedText: {
    fontSize: 12,
    color: Primary,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#CBCED4',
    marginBottom: 12,
    textAlign: "auto",
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    paddingHorizontal: 3
  },
  contactInfo: {
    marginTop: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 12,
    width: 20,
    textAlign: 'center'
  },
  contactText: {
    fontSize: 14,
    color: white,
  },
});

export default BusinessCard;
