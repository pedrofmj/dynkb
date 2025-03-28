import { Request, Response } from "express";
import { loadDatabase, saveDatabase } from "../models/databaseModel";
import {
  getTopics as getTopicsService,
  addTopic as addTopicService,
  updateTopic as updateTopicService,
  deleteTopic as deleteTopicService,
  buildTopicTree,
  findShortestPath,
} from "../services/topicService";

interface Topic {
  id: number;
  name: string;
  content: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  parentTopicId: number | null;
}

interface TopicTree {
  id: number;
  name: string;
  content: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  parentTopicId: number | null;
  children: TopicTree[] | "loop";
}

/**
 * Utility function to ensure all properties are present in a topic object.
 * @param topic - The topic object to format.
 * @returns A formatted topic object with default values for missing properties.
 */
const formatTopic = (topic: Partial<Topic>): Topic => ({
  id: topic.id ?? 0, // Default to 0 if null
  name: topic.name ?? "", // Default to empty string if null
  content: topic.content ?? "", // Default to empty string if null
  description: topic.description ?? "", // Default to empty string if null
  createdAt: topic.createdAt ?? new Date().toISOString(), // Default to current date if null
  updatedAt: topic.updatedAt ?? new Date().toISOString(), // Default to current date if null
  version: topic.version ?? 0, // Default to 0 if null
  parentTopicId: topic.parentTopicId ?? null, // Default to null if null
});

/**
 * Get all topics (only the highest version for each id).
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const getTopics = (req: Request, res: Response): void => {
  try {
    const topics = getTopicsService();
    res.status(200).json(topics);
  } catch (error) {
    console.error("Error loading topics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Add a new topic (always with version 0).
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const addTopic = (req: Request, res: Response): void => {
  try {
    const { name, content, description, parentTopicId } = req.body;

    // Validate required fields
    if (!name || !content) {
      res.status(400).json({ error: "Name and content are required" });
      return;
    }

    const newTopic = addTopicService(name, content, description, parentTopicId);
    res.status(201).json(newTopic);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Name and content are required") {
        res.status(400).json({ error: error.message });
      } else {
        console.error("Error adding topic:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      console.error("Unknown error adding topic:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

/**
 * Update a topic (creates a new record with incremented version).
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const updateTopic = (req: Request, res: Response): void => {
  try {
    const topicId = parseInt(req.params.id, 10);
    const updates = req.body;

    const updatedTopic = updateTopicService(topicId, updates);
    res.status(200).json(updatedTopic);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Topic not found") {
        res.status(404).json({ error: error.message });
      } else {
        console.error("Error updating topic:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      console.error("Unknown error updating topic:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

/**
 * Delete a topic (deletes all versions of the topic with the given id).
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const deleteTopic = (req: Request, res: Response): void => {
  try {
    const topicId = parseInt(req.params.id, 10);
    deleteTopicService(topicId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Topic not found") {
        res.status(404).json({ error: error.message });
      } else {
        console.error("Error deleting topic:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      console.error("Unknown error deleting topic:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

/**
 * Get a topic and its recursive children, ensuring only the latest versions are used.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const getRecursiveTopic = (req: Request, res: Response): void => {
  try {
    const topicId = parseInt(req.params.id, 10);

    if (isNaN(topicId)) {
      res.status(400).json({ error: "Invalid topic ID" });
      return;
    }

    const topicTree = buildTopicTree(topicId);

    if (!topicTree) {
      res.status(404).json({ error: "Topic not found" });
      return;
    }

    res.status(200).json(topicTree);
  } catch (error) {
    console.error("Error fetching recursive topic:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get the shortest path between two topics.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const getShortestPath = (req: Request, res: Response): void => {
  try {
    const startId = parseInt(req.params.id1, 10);
    const endId = parseInt(req.params.id2, 10);
    const expand = req.query.expand === "true" || req.query.expand === "1"; // Check for expand query parameter

    if (isNaN(startId) || isNaN(endId)) {
      res.status(400).json({ error: "Invalid topic IDs" });
      return;
    }

    const pathIds = findShortestPath(startId, endId);

    if (!pathIds) {
      res.status(404).json({ error: "No path found between the topics" });
      return;
    }

    if (expand) {
      // Fetch full topic nodes for the path
      const database = loadDatabase();
      const pathNodes = pathIds.map((id) => {
        const topic = database.topics
          .filter((t) => t.id === id)
          .reduce((acc, t) => (acc.version > t.version ? acc : t), {} as Topic);
        return formatTopic(topic);
      });
      res.status(200).json({ path: pathNodes });
    } else {
      // Return only the IDs
      res.status(200).json({ path: pathIds });
    }
  } catch (error) {
    console.error("Error finding shortest path:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
