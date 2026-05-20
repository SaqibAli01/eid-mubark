import * as Crypto from "expo-crypto";

export async function hashPassword(password: string): Promise<string> {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password,
  );
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  const h = await hashPassword(password);
  return h === hash;
}
