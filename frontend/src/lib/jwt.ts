/**
 * Generate a HS256 JWT using the Web Crypto API (zero dependencies).
 */

function base64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function strToBase64url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function generateJwt(
  userId: string,
  userName: string,
  secret: string,
): Promise<string> {
  const encoder = new TextEncoder();

  // Import HMAC key
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const now = Math.floor(Date.now() / 1000);

  const header = strToBase64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = strToBase64url(
    JSON.stringify({
      sub: userId,
      userId,
      name: userName,
      iat: now,
      exp: now + 3600,
    }),
  );

  const data = `${header}.${payload}`;
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(data));

  return `${data}.${base64url(sig)}`;
}
