import fs from "fs";
import path from "path";

const DB_PATH = "db/database.json";

const generateDatabase = () => {
  const topics = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    name: `Topic ${i + 1}`,
    content: `Detailed content for Topic ${i + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
    parentTopicId: i > 20 ? i - 20 : null, // Example hierarchical structure
  }));

  const users = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      role: "Admin",
      createdAt: new Date().toISOString(),
    },
    ...Array.from({ length: 40 }, (_, i) => ({
      id: i + 2,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: "Viewer",
      createdAt: new Date().toISOString(),
    })),
  ];

  const resources = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    topicId: i + 1,
    url: `http://example.com/resource${i + 1}`,
    description: `Description for Resource ${i + 1}`,
    type: i % 3 === 0 ? "pdf" : i % 2 === 0 ? "video" : "article", // Alternating types
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const database = { topics, users, resources };

  // Ensure the directory exists
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

  // Write the database to the file
  fs.writeFileSync(DB_PATH, JSON.stringify(database, null, 2), "utf-8");
  console.log(`Database generated at ${DB_PATH}`);
};

generateDatabase();