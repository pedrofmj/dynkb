import { loadDatabase, saveDatabase } from "../models/databaseModel";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// Get all users
export const getUsers = (): User[] => {
  const database = loadDatabase();
  return database.users;
};

// Add a new user
export const addUser = (name: string, email: string, role: string = "Viewer"): User => {
  const database = loadDatabase();

  // Validate email format
  if (!email.includes("@")) {
    throw new Error("Invalid email format");
  }

  // Check for duplicate email
  const emailExists = database.users.some((user) => user.email === email);
  if (emailExists) {
    throw new Error("Email already exists");
  }

  const newUser: User = {
    id: database.users.length ? database.users[database.users.length - 1].id + 1 : 1,
    name,
    email,
    role,
    createdAt: new Date().toISOString(),
  };

  database.users.push(newUser);
  saveDatabase(database);
  return newUser;
};

// Update a user
export const updateUser = (userId: number, updates: Partial<User>): User => {
  const database = loadDatabase();

  // Find the user to update
  const userIndex = database.users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    throw new Error("User not found");
  }

  // Validate email if provided
  if (updates.email && !updates.email.includes("@")) {
    throw new Error("Invalid email format");
  }

  // Check for duplicate email (excluding the current user)
  if (updates.email) {
    const emailExists = database.users.some(
      (user) => user.email === updates.email && user.id !== userId
    );
    if (emailExists) {
      throw new Error("Email already exists");
    }
  }

  // Update the user
  const updatedUser = {
    ...database.users[userIndex],
    ...updates,
  };

  database.users[userIndex] = updatedUser;
  saveDatabase(database);
  return updatedUser;
};

// Delete a user
export const deleteUser = (userId: number): void => {
  const database = loadDatabase();

  // Find the user to delete
  const userIndex = database.users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    throw new Error("User not found");
  }

  // Remove the user
  database.users.splice(userIndex, 1);
  saveDatabase(database);
};
