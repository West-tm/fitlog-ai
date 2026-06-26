// src/lib/google-health-token-crypto.ts
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TOKEN_PREFIX = "v1";

function getTokenEncryptionKey() {
  const key = process.env.GOOGLE_HEALTH_TOKEN_ENCRYPTION_KEY;

  if (!key) throw new Error("GOOGLE_HEALTH_TOKEN_ENCRYPTION_KEY is not set");

  const decodedKey = Buffer.from(key, "base64");

  if (decodedKey.length !== 32) {
    throw new Error(
      "GOOGLE_HEALTH_TOKEN_ENCRYPTION_KEY must be 32 bytes base64",
    );
  }

  return decodedKey;
}

export function encryptGoogleHealthToken(token: string) {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getTokenEncryptionKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    TOKEN_PREFIX,
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

export function decryptGoogleHealthToken(encryptedToken: string) {
  const [version, iv, authTag, encrypted] = encryptedToken.split(":");

  if (version !== TOKEN_PREFIX || !iv || !authTag || !encrypted) {
    throw new Error("Invalid encrypted Google Health token format");
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    getTokenEncryptionKey(),
    Buffer.from(iv, "base64"),
  );

  decipher.setAuthTag(Buffer.from(authTag, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64")),
    decipher.final(),
  ]).toString("utf8");
}
