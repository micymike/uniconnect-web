import CryptoJS from "crypto-js";

// WARNING: In production, use a secure key exchange mechanism.
// For demo, this is a static key per chatroom.
export function encryptMessage(plaintext, secret) {
  return CryptoJS.AES.encrypt(plaintext, secret).toString();
}

export function decryptMessage(ciphertext, secret) {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return "";
  }
}
