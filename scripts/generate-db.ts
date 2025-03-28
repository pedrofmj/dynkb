import fs from "fs";
import path from "path";

const DB_PATH = "db/database.json";

const generateDatabase = () => {
  const database = {
    topics: [],
    users: [
      {
        id: 1,
        name: "Admin User",
        email: "admin@example.com",
        role: "Admin",
        createdAt: new Date().toISOString(),
      },
    ],
    resources: [],
  };

  // Ensure the directory exists
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

  // Write the database to the file
  fs.writeFileSync(DB_PATH, JSON.stringify(database, null, 2), "utf-8");
  console.log(`Database generated at ${DB_PATH}`);
};

generateDatabase();