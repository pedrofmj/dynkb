import express, { Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import controllers
import {
  getTopics,
  addTopic,
  getRecursiveTopic,
  getShortestPath,
} from "./controllers/topicController";
import { getUsers, addUser } from "./controllers/userController";
import { getResources, addResource } from "./controllers/resourceController";

// Initialize the Express app
const app: Application = express();
app.use(bodyParser.json());

// Define routes

// Topic routes
app.get("/api/topics", getTopics);
app.post("/api/topics", addTopic);
app.get("/api/recursive/topic/:id", getRecursiveTopic); // New route for recursive topic
app.get("/api/path/:id1/:id2", getShortestPath); // New route for shortest path

// User routes
app.get("/api/users", getUsers);
app.post("/api/users", addUser);

// Resource routes
app.get("/api/resources", getResources);
app.post("/api/resources", addResource);

// Start the server
const PORT = parseInt(process.env.PORT || "3000", 10);
const BIND_ADDRESS = process.env.BIND_ADDRESS || "0.0.0.0";

app.listen(PORT, BIND_ADDRESS, () => {
  console.log(`Server is running at http://${BIND_ADDRESS}:${PORT}`);
});

export default app;
