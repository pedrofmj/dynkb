import fs from "fs";
import path from "path";

const DB_PATH = process.env.DB_PATH || "db/database.json";

// Define the shape of the database
interface Database {
  topics: Array<{
    id: number;
    name: string;
    content: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    parentTopicId: number | null;
  }>;
  resources: Array<{
    id: number;
    topicId: number | null;
    url: string;
    title: string;
    description: string;
    type: string; // e.g., video, article, pdf
    createdAt: string;
    updatedAt: string;
  }>;
  users: Array<{
    id: number;
    name: string;
    email: string;
    role: string; // e.g., Admin, Editor, Viewer
    createdAt: string;
  }>;
}

// Load the database from the file
export const loadDatabase = (): Database => {
  try {
    const data = fs.readFileSync(path.resolve(DB_PATH), "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading database:", (error as Error).message);
    process.exit(1);
  }
};

// Save the database to the file
export const saveDatabase = (data: Database): void => {
  try {
    fs.writeFileSync(path.resolve(DB_PATH), JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving database:", (error as Error).message);
  }
};

/**
 * Creates a new database object with default empty arrays for topics, users, and resources.
 * @returns A new Database object
 */
export const createDatabase = (): Database => {
  return {
    topics: [],
    resources: [],
    users: [],
  };
};
