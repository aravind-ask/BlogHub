import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { IUser } from "../interfaces/user.interface";
import { HttpStatus, ErrorMessage } from "../constants/enums";
import { IResponse } from "../interfaces/response.interface";
import { env } from "../config/env.config";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<IResponse<IUser>> {
    try {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        return {
          success: false,
          message: "User already exists",
          error: ErrorMessage.BAD_REQUEST,
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userRepository.create({
        email,
        password: hashedPassword,
        name,
      });

      return {
        success: true,
        message: "User registered successfully",
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: ErrorMessage.SERVER_ERROR,
        error: (error as Error).message,
      };
    }
  }

  async login(email: string, password: string): Promise<IResponse<string>> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user || !user.password) {
        return {
          success: false,
          message: ErrorMessage.UNAUTHORIZED,
          error: "Invalid credentials",
        };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          success: false,
          message: ErrorMessage.UNAUTHORIZED,
          error: "Invalid credentials",
        };
      }

      const token = jwt.sign(
        { id: user._id?.toString(), role: user.role },
        env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return { success: true, message: "Login successful", data: token };
    } catch (error) {
      return {
        success: false,
        message: ErrorMessage.SERVER_ERROR,
        error: (error as Error).message,
      };
    }
  }
}
