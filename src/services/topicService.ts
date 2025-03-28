import { loadDatabase, saveDatabase } from "../models/databaseModel";

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
  id: topic.id ?? 0,
  name: topic.name ?? "",
  content: topic.content ?? "",
  description: topic.description ?? "",
  createdAt: topic.createdAt ?? new Date().toISOString(),
  updatedAt: topic.updatedAt ?? new Date().toISOString(),
  version: topic.version ?? 0,
  parentTopicId: topic.parentTopicId ?? null,
});

/**
 * Get all topics (only the highest version for each id).
 * @returns An array of the latest versions of all topics.
 */
export const getTopics = (): Topic[] => {
  const database = loadDatabase();

  // Find the highest version for each topic id
  const latestTopics = Object.values(
    database.topics.reduce((acc, topic) => {
      if (!acc[topic.id] || acc[topic.id].version < topic.version) {
        acc[topic.id] = formatTopic(topic);
      }
      return acc;
    }, {} as Record<number, Topic>)
  );

  return latestTopics;
};

/**
 * Add a new topic (always with version 0).
 * @param name - The name of the topic.
 * @param content - The content of the topic.
 * @param description - The description of the topic.
 * @param parentTopicId - The ID of the parent topic (optional).
 * @returns The newly created topic.
 */
export const addTopic = (
  name: string,
  content: string,
  description: string = "",
  parentTopicId: number | null = null
): Topic => {
  const database = loadDatabase();

  // Validate required fields
  if (!name || !content) {
    throw new Error("Name and content are required");
  }

  const newTopic = formatTopic({
    id: database.topics.length ? database.topics[database.topics.length - 1].id + 1 : 1,
    name,
    content,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 0, // Always start with version 0
    parentTopicId,
  });

  database.topics.push(newTopic);
  saveDatabase(database);
  return newTopic;
};

/**
 * Update a topic (creates a new record with incremented version).
 * @param topicId - The ID of the topic to update.
 * @param updates - The updates to apply to the topic.
 * @returns The updated topic.
 */
export const updateTopic = (topicId: number, updates: Partial<Topic>): Topic => {
  const database = loadDatabase();

  // Find all versions of the topic with the given id
  const topicVersions = database.topics.filter((topic) => topic.id === topicId);

  if (topicVersions.length === 0) {
    throw new Error("Topic not found");
  }

  // Get the highest version of the topic
  const maxVersion = Math.max(...topicVersions.map((topic) => topic.version));

  const newTopicVersion = formatTopic({
    ...topicVersions.find((topic) => topic.version === maxVersion), // Get the highest version topic
    ...updates, // Apply updates
    updatedAt: new Date().toISOString(),
    version: maxVersion + 1, // Increment version
  });

  database.topics.push(newTopicVersion);
  saveDatabase(database);
  return newTopicVersion;
};

/**
 * Delete a topic (deletes all versions of the topic with the given id).
 * @param topicId - The ID of the topic to delete.
 */
export const deleteTopic = (topicId: number): void => {
  const database = loadDatabase();

  // Filter out all versions of the topic with the given id
  const filteredTopics = database.topics.filter((topic) => topic.id !== topicId);

  if (filteredTopics.length === database.topics.length) {
    throw new Error("Topic not found");
  }

  database.topics = filteredTopics;
  saveDatabase(database);
};

/**
 * Recursive function to build the topic tree, ensuring only the latest versions are used.
 * @param topicId - The ID of the topic to build the tree for.
 * @param visited - A Set to track visited topic IDs and detect circular references.
 * @returns The topic tree with children recursively populated.
 */
export const buildTopicTree = (topicId: number, visited: Set<number> = new Set()): TopicTree | null => {
  const database = loadDatabase();

  // Find the latest version of the topic
  const latestTopic = database.topics
    .filter((topic) => topic.id === topicId)
    .reduce((acc, topic) => (acc.version > topic.version ? acc : topic), {} as Topic);

  if (!latestTopic.id) {
    return null;
  }

  // Check for circular reference
  if (visited.has(topicId)) {
    return { ...formatTopic(latestTopic), children: "loop" };
  }

  visited.add(topicId);

  // Find children of the topic (only latest versions)
  const children: TopicTree[] = database.topics
    .filter((topic) => topic.parentTopicId === topicId)
    .reduce((acc, topic) => {
      const latestChild = database.topics
        .filter((t) => t.id === topic.id)
        .reduce((a, t) => (a.version > t.version ? a : t), {} as Topic);
      if (latestChild.id) {
        acc.push(formatTopic(latestChild));
      }
      return acc;
    }, [] as Topic[])
    .map((topic) => buildTopicTree(topic.id, new Set(visited)) as TopicTree);

  return {
    ...formatTopic(latestTopic),
    children: children.length ? children : [],
  };
};

/**
 * Find the shortest path between two topics using Breadth-First Search (BFS).
 * @param startId - The ID of the starting topic.
 * @param endId - The ID of the destination topic.
 * @returns An array of topic IDs representing the shortest path, or null if no path exists.
 */
export const findShortestPath = (startId: number, endId: number): number[] | null => {
  const database = loadDatabase();

  // Create a map of topics for quick lookup
  const topicMap = new Map<number, Topic>();
  database.topics.forEach((topic) => {
    if (!topicMap.has(topic.id) || topicMap.get(topic.id)!.version < topic.version) {
      topicMap.set(topic.id, topic);
    }
  });

  // BFS queue: stores the current topic ID and the path taken to reach it
  const queue: { id: number; path: number[] }[] = [{ id: startId, path: [startId] }];
  const visited = new Set<number>();

  while (queue.length > 0) {
    const { id, path } = queue.shift()!;

    // If the destination is reached, return the path
    if (id === endId) {
      return path;
    }

    // Mark the current topic as visited
    visited.add(id);

    // Get the current topic
    const currentTopic = topicMap.get(id);
    if (!currentTopic) continue;

    // Explore the parent topic
    if (currentTopic.parentTopicId !== null && !visited.has(currentTopic.parentTopicId)) {
      queue.push({ id: currentTopic.parentTopicId, path: [...path, currentTopic.parentTopicId] });
    }

    // Explore child topics
    const children = database.topics.filter((topic) => topic.parentTopicId === id);
    for (const child of children) {
      if (!visited.has(child.id)) {
        queue.push({ id: child.id, path: [...path, child.id] });
      }
    }
  }

  // If no path is found, return null
  return null;
};
