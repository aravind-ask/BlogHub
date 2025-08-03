import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { IUser } from "../interfaces/user.interface";
import { HttpStatus, ErrorMessage } from "../constants/enums";
import { IResponse } from "../interfaces/response.interface";
import { env } from "../config/env.config";
import { ResponseHandler } from "../utils/response.handler";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<IResponse<IUser>> {
    try {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        return ResponseHandler.error<IUser>(
          "User already exists",
          ErrorMessage.BAD_REQUEST,
          HttpStatus.BAD_REQUEST
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.userRepository.create({
        email,
        password: hashedPassword,
        name,
      });

      return ResponseHandler.success(
        user,
        "User registered successfully",
        HttpStatus.CREATED
      );
    } catch (error) {
      return ResponseHandler.error(
        ErrorMessage.SERVER_ERROR,
        error instanceof Error ? error.message : "Unknown error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async login(email: string, password: string): Promise<IResponse<AuthTokens>> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user || !user.password) {
        return ResponseHandler.error(
          "Invalid credentials",
          ErrorMessage.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return ResponseHandler.error(
          "Invalid credentials",
          ErrorMessage.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }

      // Ensure user._id exists before using it
      if (!user._id) {
        return ResponseHandler.error(
          "User ID not found",
          ErrorMessage.SERVER_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const accessToken = jwt.sign(
        { id: user._id.toString(), role: user.role },
        env.JWT_SECRET || "fallback-secret",
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { id: user._id.toString() },
        env.JWT_REFRESH_SECRET || "fallback-refresh-secret",
        { expiresIn: "7d" }
      );

      await this.userRepository.addRefreshToken(
        user._id.toString(),
        refreshToken
      );

      return ResponseHandler.success(
        { accessToken, refreshToken },
        "Login successful",
        HttpStatus.OK
      );
    } catch (error) {
      return ResponseHandler.error(
        error instanceof Error ? error.message : "Unknown error",
        ErrorMessage.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async refreshToken(refreshToken: string): Promise<IResponse<AuthTokens>> {
    try {
      const user = await this.userRepository.findByRefreshToken(refreshToken);
      if (!user) {
        return ResponseHandler.error(
          "Invalid refresh token",
          ErrorMessage.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }

      // Ensure user._id exists before using it
      if (!user._id) {
        return ResponseHandler.error(
          "User ID not found",
          ErrorMessage.SERVER_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const decoded = jwt.verify(
        refreshToken,
        env.JWT_REFRESH_SECRET || "fallback-refresh-secret"
      ) as { id: string };

      if (decoded.id !== user._id.toString()) {
        return ResponseHandler.error(
          "Invalid refresh token",
          ErrorMessage.UNAUTHORIZED,
          HttpStatus.UNAUTHORIZED
        );
      }

      const accessToken = jwt.sign(
        { id: user._id.toString(), role: user.role },
        env.JWT_SECRET || "fallback-secret",
        { expiresIn: "15m" }
      );

      return ResponseHandler.success(
        { accessToken, refreshToken },
        "Token refreshed successfully",
        HttpStatus.OK
      );
    } catch (error) {
      return ResponseHandler.error(
        error instanceof Error ? error.message : "Invalid refresh token",
        ErrorMessage.UNAUTHORIZED,
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async logout(userId: string, refreshToken: string): Promise<IResponse<null>> {
    try {
      await this.userRepository.removeRefreshToken(userId, refreshToken);
      return ResponseHandler.success(
        null,
        "Logged out successfully",
        HttpStatus.OK
      );
    } catch (error) {
      return ResponseHandler.error(
        ErrorMessage.SERVER_ERROR,
        error instanceof Error ? error.message : "Unknown error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getCurrentUser(userId: string): Promise<IResponse<IUser>> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return ResponseHandler.error(
          ErrorMessage.NOT_FOUND,
          "User not found",
          HttpStatus.NOT_FOUND
        );
      }
      return ResponseHandler.success(
        user,
        "User fetched successfully",
        HttpStatus.OK
      );
    } catch (error) {
      return ResponseHandler.error(
        ErrorMessage.SERVER_ERROR,
        error instanceof Error ? error.message : "Unknown error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
