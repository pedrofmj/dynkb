import { Request, Response } from "express";
import {
  getUsers as getUsersService,
  addUser as addUserService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from "../services/userService";

// Get all users
export const getUsers = (req: Request, res: Response): void => {
  try {
    const users = getUsersService();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add a new user
export const addUser = (req: Request, res: Response): void => {
  try {
    const { name, email, role } = req.body;

    // Validate required fields
    if (!name || !email) {
      res.status(400).json({ error: "Name and email are required" });
      return;
    }

    const newUser = addUserService(name, email, role);
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Invalid email format") {
        res.status(400).json({ error: error.message });
      } else if (error.message === "Email already exists") {
        res.status(409).json({ error: error.message });
      } else {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      console.error("Unknown error adding user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// Update a user
export const updateUser = (req: Request, res: Response): void => {
  try {
    const userId = parseInt(req.params.id, 10);
    const updates = req.body;

    const updatedUser = updateUserService(userId, updates);
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User not found") {
        res.status(404).json({ error: error.message });
      } else if (error.message === "Invalid email format") {
        res.status(400).json({ error: error.message });
      } else if (error.message === "Email already exists") {
        res.status(409).json({ error: error.message });
      } else {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      console.error("Unknown error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// Delete a user
export const deleteUser = (req: Request, res: Response): void => {
  try {
    const userId = parseInt(req.params.id, 10);
    deleteUserService(userId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User not found") {
        res.status(404).json({ error: error.message });
      } else {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      console.error("Unknown error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
