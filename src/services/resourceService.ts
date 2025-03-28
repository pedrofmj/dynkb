import { loadDatabase, saveDatabase } from "../models/databaseModel";

interface Resource {
  id: number;
  title: string;
  topicId: number | null;
  url: string;
  description: string;
  type: string; // e.g., video, article, pdf
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all resources.
 * @returns An array of all resources.
 */
export const getResources = (): Resource[] => {
  const database = loadDatabase();
  // Ensure all resources have a title
  return database.resources.map((resource) => ({
    ...resource,
    title: resource.title || "Untitled Resource", // Default title if missing
  }));
};

/**
 * Add a new resource.
 * @param title - The title of the resource.
 * @param url - The URL of the resource.
 * @param type - The type of the resource (e.g., video, article, pdf).
 * @param topicId - The ID of the associated topic (optional).
 * @param description - The description of the resource (optional).
 * @returns The newly created resource.
 */
export const addResource = (
  title: string,
  url: string,
  type: string,
  topicId: number | null = null,
  description: string = ""
): Resource => {
  const database = loadDatabase();

  // Validate required fields
  if (!title || !url || !type) {
    throw new Error("Title, URL, and type are required");
  }

  const newResource: Resource = {
    id: database.resources.length ? database.resources[database.resources.length - 1].id + 1 : 1,
    title,
    topicId,
    url,
    description,
    type,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  database.resources.push(newResource);
  saveDatabase(database);
  return newResource;
};

/**
 * Update a resource.
 * @param resourceId - The ID of the resource to update.
 * @param updates - The updates to apply to the resource.
 * @returns The updated resource.
 */
export const updateResource = (resourceId: number, updates: Partial<Resource>): Resource => {
  const database = loadDatabase();

  // Find the resource to update
  const resourceIndex = database.resources.findIndex((resource) => resource.id === resourceId);

  if (resourceIndex === -1) {
    throw new Error("Resource not found");
  }

  // Validate required fields if provided
  if (updates.title && !updates.title.trim()) {
    throw new Error("Title cannot be empty");
  }

  const updatedResource: Resource = {
    ...database.resources[resourceIndex],
    ...updates,
    updatedAt: new Date().toISOString(), // Update the timestamp
  };

  // Ensure title is not undefined
  if (updatedResource.title === undefined) {
    updatedResource.title = database.resources[resourceIndex].title || "Untitled Resource";
  }

  database.resources[resourceIndex] = updatedResource;
  saveDatabase(database);
  return updatedResource;
};

/**
 * Delete a resource.
 * @param resourceId - The ID of the resource to delete.
 */
export const deleteResource = (resourceId: number): void => {
  const database = loadDatabase();

  // Find the resource to delete
  const resourceIndex = database.resources.findIndex((resource) => resource.id === resourceId);

  if (resourceIndex === -1) {
    throw new Error("Resource not found");
  }

  database.resources.splice(resourceIndex, 1);
  saveDatabase(database);
};
