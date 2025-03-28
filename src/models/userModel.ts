/**
 * User Model
 * Represents a user in the knowledge base system.
 */
export interface User {
    id: string; // Unique identifier for the user
    name: string; // Name of the user
    email: string; // Email address of the user
    role: "Admin" | "Editor" | "Viewer"; // Role of the user
    createdAt: Date; // Timestamp when the user was created
}

/**
 * Creates a new User object
 * @param id - Unique identifier for the user
 * @param name - Name of the user
 * @param email - Email address of the user
 * @param role - Role of the user ("Admin", "Editor", or "Viewer")
 * @returns A new User object with default values
 */
export const createUser = (
    id: string,
    name: string,
    email: string,
    role: "Admin" | "Editor" | "Viewer"
): User => {
    const now = new Date();
    return {
        id,
        name,
        email,
        role,
        createdAt: now,
    };
};