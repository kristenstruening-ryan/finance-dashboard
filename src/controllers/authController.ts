import { Request, Response } from "express";
import * as authService from "../services/authService"; // One source of truth

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password not provided" });
    }

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const newUser = await authService.createUser(email, password, name);
    return res.status(201).json({
      message: "User signup successful!",
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    const user = await authService.findUserByEmail(email);
    console.log("1. User found:", !!user);

    if (!user) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    const isMatch = await authService.verifyPassword(password, user.password);
    console.log("2. Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }

    console.log("3. Generating token...");
    const token = authService.generateToken(user);
    console.log("4. Token generated successfully");

    return res.status(200).json({
      message: "Welcome! Login successful!",
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("DEBUG LOGIN ERROR:", error);
    return res.status(500).json({ error: "Server Error" });
  }
};