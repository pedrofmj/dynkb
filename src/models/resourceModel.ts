/**
 * Resource Model
 * Represents a resource linked to a topic.
 */
export interface Resource {
    id: string; // Unique identifier for the resource
    topicId: string; // ID of the topic this resource is linked to
    url: string; // URL of the resource
    description: string; // Description of the resource
    type: "video" | "article" | "pdf"; // Type of resource
    createdAt: Date; // Timestamp when the resource was created
    updatedAt: Date; // Timestamp when the resource was last updated
}

/**
 * Creates a new Resource object
 * @param id - Unique identifier for the resource
 * @param topicId - ID of the topic this resource is linked to
 * @param url - URL of the resource
 * @param description - Description of the resource
 * @param type - Type of the resource ("video", "article", or "pdf")
 * @returns A new Resource object with default values
 */
export const createResource = (
    id: string,
    topicId: string,
    url: string,
    description: string,
    type: "video" | "article" | "pdf"
): Resource => {
    const now = new Date();
    return {
        id,
        topicId,
        url,
        description,
        type,
        createdAt: now,
        updatedAt: now,
    };
};