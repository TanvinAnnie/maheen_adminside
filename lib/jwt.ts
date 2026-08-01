import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

// Generate JWT
export const generateToken = ({
  id,
  email,
  role,
}: {
  id: string;
  email: string;
  role: string;
}) => {
  return jwt.sign(
    {
      id,
      email,
      role,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Verify JWT
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
};