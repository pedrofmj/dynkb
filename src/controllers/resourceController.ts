import { Request, Response } from "express";
import {
  getResources as getResourcesService,
  addResource as addResourceService,
  updateResource as updateResourceService,
  deleteResource as deleteResourceService,
} from "../services/resourceService";

/**
 * Get all resources.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const getResources = (req: Request, res: Response): void => {
  try {
    const resources = getResourcesService();
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error loading resources:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Add a new resource.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const addResource = (req: Request, res: Response): void => {
  try {
    const { title, url, type, topicId, description } = req.body;

    // Validate required fields
    if (!title || !url || !type) {
      res.status(400).json({ error: "Title, URL, and type are required" });
      return;
    }

    const newResource = addResourceService(title, url, type, topicId, description);
    res.status(201).json(newResource);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Title, URL, and type are required") {
        res.status(400).json({ error: error.message });
      } else {
        console.error("Error adding resource:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      console.error("Unknown error adding resource:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

/**
 * Update a resource.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const updateResource = (req: Request, res: Response): void => {
  try {
    const resourceId = parseInt(req.params.id, 10);
    const updates = req.body;

    // Validate required fields if provided
    if (updates.title && !updates.title.trim()) {
      res.status(400).json({ error: "Title cannot be empty" });
      return;
    }

    const updatedResource = updateResourceService(resourceId, updates);
    res.status(200).json(updatedResource);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Resource not found") {
        res.status(404).json({ error: error.message });
      } else if (error.message === "Title cannot be empty") {
        res.status(400).json({ error: error.message });
      } else {
        console.error("Error updating resource:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      console.error("Unknown error updating resource:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

/**
 * Delete a resource.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const deleteResource = (req: Request, res: Response): void => {
  try {
    const resourceId = parseInt(req.params.id, 10);
    deleteResourceService(resourceId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Resource not found") {
        res.status(404).json({ error: error.message });
      } else {
        console.error("Error deleting resource:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      console.error("Unknown error deleting resource:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
