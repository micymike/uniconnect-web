import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet,ActivityIndicator,Image  } from 'react-native';
import { Primary,Gray,silver,white,secondary, Red } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';

const Imgurimodal = ({ showImageUriModal,setShowImageUriModal,currentImageType,setFrontImage,setBackImage, }) => {
    const [imageUriInput, setImageUriInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [imagePreviewError, setImagePreviewError] = useState(false);


    const handleSubmit = () => {
        if (!imageUriInput.trim()) return;
        setLoading(true);
        setTimeout(() => {
        if (currentImageType === 'front') {
            setFrontImage(imageUriInput.trim());
        } else if (currentImageType === 'back') {
            setBackImage(imageUriInput.trim());
        }
        setShowImageUriModal(false);
        setImageUriInput('');
        setLoading(false);
        }, 500); 
    };
  return (
    <Modal visible={showImageUriModal} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Enter {currentImageType} Image URI</Text>
            {imageUriInput.trim() !== '' && (
                <View style={styles.previewContainer}>
                    {!imagePreviewError ? (
                    <Image
                        source={{ uri: imageUriInput.trim() }}
                        style={styles.previewImage}
                        onError={() => setImagePreviewError(true)}
                        resizeMode="contain"
                    />
                    ) : (
                    <Text style={styles.errorText}>Invalid image URL or failed to load.</Text>
                    )}
                </View>
            )}
          <TextInput
            style={[
              styles.input,
              { borderColor: isFocused ? Primary : silver } 
            ]}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="https://example.com/image.jpg"
            value={imageUriInput}
            placeholderTextColor={Gray}
            autoCapitalize="none"
            onChangeText={(text) => {
            setImageUriInput(text);
            setImagePreviewError(false); 
            }}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.button,]}
              onPress={() => {
                setShowImageUriModal(false);
                setImageUriInput('');
              }}
              disabled={loading}
            >
              <Ionicons name="close" size={14} color={Red} />
              <Text style={{color: Red}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={loading || !imageUriInput.trim()}
            >
              {loading ? (
                <ActivityIndicator color={white} size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={{color: "#fff"}}>Submit</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Imgurimodal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: secondary,
    padding: 20,
    width: '85%',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 500,
    color: Primary,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: white,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: Red,
  },
  submitButton: {
    backgroundColor: Primary,
  },
  buttonText: {
    color: "white",
    marginLeft: 4,
    fontWeight: 500,
  },
  previewContainer: {
  alignItems: 'center',
  marginBottom: 10,
},
previewImage: {
  width: 200,
  height: 120,
  borderRadius: 8,
  backgroundColor: silver,
},
errorText: {
  color: Red,
  fontSize: 13,
  marginTop: 5,
},

});