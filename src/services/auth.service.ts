import { AppDataSource } from "../utils/data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import { sign, Secret, SignOptions, verify } from "jsonwebtoken";
import { JwtPayload } from "../utils/payload";

const userRepository = AppDataSource.getRepository(User);

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const existingUser = await userRepository.findOne({ where: { email } });
  if (existingUser) throw { status: 400, message: "Email already in use" };

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userRepository.create({ name, email, password: hashedPassword });
  return userRepository.save(user);
};

export const loginUser = async (email: string, password: string) => {
  const user = await userRepository.findOne({ where: { email } });
  if (!user) throw { status: 400, message: "Invalid credentials" };

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw { status: 400, message: "Invalid credentials" };

  const jwtSecret: Secret = process.env.JWT_SECRET as string;

  // Short-lived access token
  const accessToken = sign(
    { userId: user.id, role: user.role, type: "access" },
    jwtSecret,
    {
      expiresIn: (process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string) || "15m",
    } as SignOptions,
  );

  // Long-lived refresh token
  const refreshToken = sign(
    { userId: user.id, role: user.role, type: "refresh" },
    jwtSecret,
    {
      expiresIn: (process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string) || "1d",
    } as SignOptions,
  );

  return { accessToken, refreshToken };
};

export const refreshTokenUser = async (token: string) => {
  const jwtSecret: Secret = process.env.JWT_SECRET as string;

  try {
    const payload = verify(token, jwtSecret) as JwtPayload;

    if (payload.type !== "refresh") {
      throw { status: 401, message: "Invalid token type" };
    }

    const newAccessToken = sign(
      { userId: payload.userId, role: payload.role, type: "access" },
      jwtSecret,
      {
        expiresIn: (process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string) || "15m",
      } as SignOptions,
    );

    return { accessToken: newAccessToken };
  } catch (error) {
    throw { status: 401, message: "Invalid or expired refresh token" };
  }
};
