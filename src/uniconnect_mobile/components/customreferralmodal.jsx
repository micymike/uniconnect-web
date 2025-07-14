import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet,ActivityIndicator } from 'react-native';
import { Primary,Gray,silver,white,secondary, Red } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';

const CustomReferralModal = ({ isVisible, onClose, onContinue,isLoading,modalerror }) => {
  const [referralCode, setReferralCode] = useState('');
  const handleClose = () => {
    setReferralCode("");     
    onClose();           
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

            <Ionicons name="gift" size={22} color="#fff" style={{padding: 10,borderRadius: 40,backgroundColor: Primary,marginVertical: 10}} />
          

          <Text style={styles.modalTitle}>Have a Referral Code?</Text>
          <Text style={styles.modalSubtitle}>Enter it before continuing </Text>

          <Text style={styles.label}>Referral Code (Optional)</Text>
          <TextInput
            style={styles.input}
            onChangeText={setReferralCode}
            value={referralCode}
            placeholder="Enter referral code"
            placeholderTextColor="#888"
          />
          {modalerror && <Text style={{color: Red,alignSelf: "flex-start",marginBottom: 12}}>{modalerror}</Text>}

          <View style={styles.infoContainer}>
            <Text style={styles.infoIcon}>ⓘ</Text>
            <Text style={styles.infoText}> Enter a referral code to unlock exclusive benefits and premium access features.</Text>
          </View>

          {/* Buttons */}
          <TouchableOpacity
          activeOpacity={0.7}
          style={styles.continueButton} onPress={() => onContinue(referralCode)}>
            {isLoading ? (
               <ActivityIndicator size="small" color="#fff" />
            ) : (
           <Text style={{color: "white",fontWeight: 500,}}>Continue</Text>
           )}
          </TouchableOpacity>
          <TouchableOpacity 
          activeOpacity={0.7}
          style={styles.skipButton} onPress={() => onContinue(referralCode)}>
            {isLoading ? (
               <ActivityIndicator size="small" color="#fff" />
            ) : (
            <Text style={styles.buttonText}>Skip</Text>
           )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Gray
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
  },
  closeButtonText: {
    color: white, 
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: white,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: silver,
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: silver,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  input: {
    backgroundColor: secondary, 
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#FFF',
    marginBottom: 6,
    width: '100%',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoIcon: {
    color: Primary,
    fontSize: 16,
    marginRight: 8,
  },
  infoText: {
    fontSize: 12,
    color: silver,
    flexShrink: 1,
  },
  continueButton: {
    backgroundColor: '#F97316',
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  skipButton: {
    backgroundColor: secondary, 
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
    width: '100%',
    borderWidth: 0.4,
    borderColor: Gray
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 500,
    fontSize: 14,
  },
});

export default CustomReferralModal;