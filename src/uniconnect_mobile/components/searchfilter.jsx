import { StyleSheet, Text, View, PanResponder, Animated, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import React, { useRef, useState,useEffect } from 'react';
import { secondary, Primary, white, Gray, silver } from '../utils/colors';

const LOCATIONS = ['All', 'Egerton', 'JKUAT',];

const windowWidth = Dimensions.get('window').width;
const Searchfilter = ({ MIN_PRICE, MAX_PRICE, SLIDER_WIDTH = windowWidth *  0.5, onApply ,setFilters,filters }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const [price, setPrice] = useState(filters.price || MIN_PRICE);
  const [activeLocation, setActiveLocation] = useState(filters.location || 'All');

  useEffect(() => {
    setActiveLocation(filters.location || 'All');
    setPrice(filters.price || MIN_PRICE);

    const xPos = (filters.price / MAX_PRICE) * SLIDER_WIDTH;
    pan.setValue({ x: xPos || 0, y: 0 });
  }, [filters]); 

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let newX = Math.max(0, Math.min(SLIDER_WIDTH, gesture.dx));
        pan.setValue({ x: newX, y: 0 });

        let calculatedPrice = Math.round((newX / SLIDER_WIDTH) * MAX_PRICE);
        setPrice(calculatedPrice);
        setFilters((prev) => ({ ...prev, price: calculatedPrice }));
      },
    })
  ).current;

  const handleReset = () => {
    const resetFilters = { price: MIN_PRICE, location: 'All' };
    setFilters(resetFilters);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add filter</Text>

      <Text style={styles.label}>Location</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
        {LOCATIONS.map((location, idx) => (
          <TouchableOpacity
            key={idx}
           onPress={() => {
            setActiveLocation(location);
            setFilters((prev) => ({ ...prev, location }));
            }}
            style={[
              styles.chip,
              activeLocation === location && styles.activeChip,
            ]}
          >
            <Text style={[
              styles.chipText,
              activeLocation === location && styles.activeChipText
            ]}>
              {location}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.label}>Price Range</Text>
      <View style={styles.sliderBar}>
        <Animated.View style={[styles.sliderTrack, { width: pan.x }]} />
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.sliderThumb, { transform: [{ translateX: pan.x }] }]}
        />
      </View>
      <View style={styles.priceRow}>
        <Text style={{color: white}}>Ksh. {MIN_PRICE}</Text>
        <Text style={{color: white}}>Ksh. {price || MAX_PRICE} </Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
          <Text style={{ fontWeight: '500',color: white }}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onApply({ price, location: activeLocation })} style={styles.applyBtn}>
          <Text style={{ color: '#fff' }}>Apply Filter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Searchfilter;

const styles = StyleSheet.create({
  container: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: secondary
  },
  heading: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    color: white,
    marginHorizontal: 6
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 3,
    marginBottom: 6,
    color: silver,
    marginHorizontal: 4
  },
  scrollRow: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: secondary,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 20,
    marginRight: 8,
    borderWidth:1,
    borderColor: Gray
  },
  activeChip: {
    backgroundColor: Primary,
    borderWidth: 0
  },
  chipText: {
    color: silver,
  },
  activeChipText: {
    color: '#fff',
  },
  sliderBar: {
    width: '98%',
    height: 5,
    backgroundColor: Gray,
    borderRadius: 2,
    position: 'relative',
    marginTop: 10,
  },
  sliderTrack: {
    height: 5,
    backgroundColor: Primary,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sliderThumb: {
    width: 15,
    height: 15,
    borderRadius: 10,
    backgroundColor: Primary,
    position: 'absolute',
    top: -5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  resetBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: Gray,
  },
  applyBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: Primary,
  },
});
