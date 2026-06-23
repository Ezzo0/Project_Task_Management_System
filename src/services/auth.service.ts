import { AppDataSource } from "../utils/data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import { sign, Secret, SignOptions } from "jsonwebtoken";
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

  const jwtSecret: Secret = process.env.JWT_SECRET || "secret";
  const signOptions = {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  } as SignOptions;
  const token = sign(
    { userId: user.id, role: user.role } as JwtPayload,
    jwtSecret,
    signOptions,
  );

  return { token };
};
