import crypto from "node:crypto";

const ALGORITHM = "aes-256-cbc";
const ENCRYPTION_KEY = crypto.scryptSync("stellr_secure_encryption_key_2026", "salt", 32);
const IV_LENGTH = 16;

export function encryptPassword(text: string): string {
  if (!text) return "";
  if (text.startsWith("enc:")) {
    return text;
  }
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return "enc:" + iv.toString("hex") + ":" + encrypted;
}

export function decryptPassword(encryptedText: string): string {
  if (!encryptedText) return "";
  if (!encryptedText.startsWith("enc:")) {
    return encryptedText;
  }
  try {
    const parts = encryptedText.split(":");
    const iv = Buffer.from(parts[1], "hex");
    const encryptedTextContent = parts[2];
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedTextContent, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Decryption failed:", err);
    return encryptedText;
  }
}
