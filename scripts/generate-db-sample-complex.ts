import fs from "fs";
import path from "path";

const DB_PATH = "db/database.json";

const generatePastDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const generateDatabase = () => {
  const topics = Array.from({ length: 40 }, (_, i) => {
    const createdAt = generatePastDate(40 - i); // Older topics have earlier dates
    const updatedAt = generatePastDate(Math.floor(Math.random() * (40 - i))); // Randomly updated in the past

    // Hierarchical structure with up to three levels
    let parentTopicId = null;
    if (i > 30) {
      parentTopicId = i - 10; // Third level
    } else if (i > 20) {
      parentTopicId = i - 20; // Second level
    } else if (i > 10) {
      parentTopicId = i - 10; // First level
    }

    return {
      id: i + 1,
      name: `Topic ${i + 1}`,
      content: `Detailed content for Topic ${i + 1}`,
      createdAt,
      updatedAt,
      version: 1,
      parentTopicId,
    };
  });

  const users = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      role: "Admin",
      createdAt: generatePastDate(40), // Admin created earliest
    },
    ...Array.from({ length: 40 }, (_, i) => ({
      id: i + 2,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: "Viewer",
      createdAt: generatePastDate(39 - i), // Users created sequentially
    })),
  ];

  const resources = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    topicId: i + 1,
    url: `http://example.com/resource${i + 1}`,
    description: `Description for Resource ${i + 1}`,
    type: i % 3 === 0 ? "pdf" : i % 2 === 0 ? "video" : "article", // Alternating types
    createdAt: generatePastDate(39 - i), // Resources created sequentially
    updatedAt: generatePastDate(Math.floor(Math.random() * (39 - i))), // Randomly updated
  }));

  const database = { topics, users, resources };

  // Ensure the directory exists
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

  // Write the database to the file
  fs.writeFileSync(DB_PATH, JSON.stringify(database, null, 2), "utf-8");
  console.log(`Database generated at ${DB_PATH}`);
};

generateDatabase();
