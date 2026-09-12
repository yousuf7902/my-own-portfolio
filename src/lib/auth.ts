import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const COOKIE_NAME = "admin_token";

export function signToken(): string {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
}

export async function verifyAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return false;

    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export function getCookieName(): string {
  return COOKIE_NAME;
}
