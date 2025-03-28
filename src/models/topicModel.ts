/**
 * Topic Model
 * Represents a topic in the knowledge base.
 */
export interface Topic {
    id: string; // Unique identifier for the topic
    name: string; // Name of the topic
    content: string; // Content of the topic
    createdAt: Date; // Timestamp when the topic was created
    updatedAt: Date; // Timestamp when the topic was last updated
    version: number; // Version number for version control
    parentTopicId?: string; // Optional: ID of the parent topic for hierarchical structure
}

/**
 * Creates a new Topic object
 * @param id - Unique identifier for the topic
 * @param name - Name of the topic
 * @param content - Content of the topic
 * @param parentTopicId - Optional parent topic ID
 * @returns A new Topic object with default values
 */
export const createTopic = (
    id: string,
    name: string,
    content: string,
    parentTopicId?: string
): Topic => {
    const now = new Date();
    return {
        id,
        name,
        content,
        createdAt: now,
        updatedAt: now,
        version: 0, // Default value for version
        parentTopicId,
    };
};