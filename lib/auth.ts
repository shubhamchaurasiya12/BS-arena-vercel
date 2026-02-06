import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Ensure JWT secret exists and is typed correctly
 */
const JWT_SECRET: jwt.Secret = (() => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  return process.env.JWT_SECRET;
})();

/**
 * Sign a JWT token
 */
export function signToken(
  payload: JwtPayload | object,
  expiresIn: jwt.SignOptions["expiresIn"] = "7d"
): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify a JWT token
 */
export function verifyToken<T extends JwtPayload>(
  token: string
): T {
  return jwt.verify(token, JWT_SECRET) as T;
}
