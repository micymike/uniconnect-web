import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Dimensions, 
  Modal,
  Animated,
  TouchableWithoutFeedback 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gray, secondary, silver, white } from '../utils/colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Dropdown = ({ label, options, selectedValue, onSelect, iconName, labell,backgroundColor ,bordercolor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const openModal = () => {
    setIsOpen(true);
    setIsFocused(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsOpen(false);
      setIsFocused(false);
    });
  };

  const handleSelect = (item) => {
    onSelect(item);
    closeModal();
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={[
          styles.input,
          { 
            borderColor: isFocused ? '#F07500' : bordercolor,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center" ,
            backgroundColor: backgroundColor || secondary
          }
        ]}
        onPress={openModal}
        activeOpacity={0.8}
      >
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={{ color: selectedValue ? white : silver }}>
            {selectedValue || `Select ${labell}`}
          </Text>
        </View>
        <View>
          <Ionicons 
            name={iconName === 'chevron-down' ? (isOpen ? 'chevron-up' : 'chevron-down') : iconName} 
            size={15} 
            color={silver} 
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <Animated.View 
              style={[
                styles.modalContent,
                {
                  opacity: fadeAnim,
                  transform: [{
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  }],
                }
              ]}
            >
              <TouchableWithoutFeedback>
                <View style={styles.dropdownModal}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select {labell}</Text>
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                      <Ionicons name="close" size={18} color={silver} />
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView 
                    showsVerticalScrollIndicator={false}
                    style={styles.optionsList}
                  >
                    {options.map((item, index) => (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        key={index}
                        style={[
                          styles.option,
                          selectedValue === item && styles.selectedOption
                        ]}
                        onPress={() => handleSelect(item)}
                      >
                        <Text style={[
                          styles.optionText,
                          selectedValue === item && styles.selectedOptionText
                        ]}>
                          {item}
                        </Text>
                        {selectedValue === item && (
                          <Ionicons name="checkmark" size={20} color="#F07500" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 2,
    color: silver,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
    // backgroundColor: secondary,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: windowWidth * 0.85,
    maxHeight: windowHeight * 0.6,
  },
  dropdownModal: {
    backgroundColor: "#1A1A1A",
    borderRadius: 7,
    borderWidth: 0.7,
    borderColor: "#374151",
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 0.7,
    borderBottomColor: Gray,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: white,
  },
  closeButton: {
    padding: 2,
  },
  optionsList: {
    maxHeight: windowHeight * 0.5,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Gray,
  },
  selectedOption: {
    backgroundColor: 'rgba(240, 117, 0, 0.1)',
  },
  optionText: {
    color: silver,
    fontSize: 14,
    flex: 1,
  },
  selectedOptionText: {
    color: '#F07500',
    fontWeight: '500',
  },
});

export default Dropdown;