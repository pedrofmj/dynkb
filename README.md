# Dynamic Knowledge Base System (DynKB)

The **Dynamic Knowledge Base System (DynKB)** is a lightweight, extensible, and type-safe RESTful API designed to manage knowledge bases dynamically. It allows users to manage topics, users, and resources efficiently, making it ideal for educational systems, content management, and collaborative learning platforms.

## Features

- Manage **topics** with descriptions.
- Manage **users** with roles (e.g., admin, user).
- Manage **resources** linked to specific topics.
- Fully type-safe implementation using TypeScript.
- Persistent storage using JSON files for simplicity.
- Extensible and lightweight design for easy customization.

## Table of Contents

- [System Overview](#system-overview)
- [Database Documentation](#database-documentation)
  - [ER Diagram](#er-diagram)
  - [Database Schema](#database-schema)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Server](#running-the-server)
  - [Running the Tests](#running-the-tests)
- [API Documentation](#api-documentation)
  - [Topics](#topics)
  - [Users](#users)
  - [Resources](#resources)
- [Code Documentation](#code-documentation)
  - [Models](#models)
  - [Controllers](#controllers)
  - [Routes](#routes)

## System Overview

The **Dynamic Knowledge Base System (DynKB)** is built using Node.js and Express, with TypeScript for type safety. It uses a JSON file as the database to store topics, users, and resources. This makes it lightweight and easy to set up without requiring a complex database system.

The system is structured around three main entities:
- **Topics**: Categories or subjects in the knowledge base.
- **Users**: Individuals interacting with the system, each having a role (e.g., admin or user).
- **Resources**: Links or content related to specific topics.

## Database Documentation

The database is stored in a JSON file (`db/database.json`) and contains three main collections: `topics`, `users`, and `resources`.

### ER Diagram

Below is the Entity-Relationship (ER) diagram for the database:

```
+------------------+       +------------------+       +------------------+
|     Topics       |       |      Users       |       |    Resources     |
+------------------+       +------------------+       +------------------+
| id (PK)          |       | id (PK)          |       | id (PK)          |
| name             |       | username         |       | title            |
| description      |       | email            |       | url              |
+------------------+       | role             |       | topicId (FK)     |
                           +------------------+       +------------------+
                                                            |
                                                            |
                                          +-----------------+
                                          |
                                          v
                                    Topics.id (FK)
```

### Database Schema

#### Topics
- **id** (number): Primary key, unique identifier for each topic.
- **name** (string): Name of the topic.
- **description** (string): Description of the topic.

#### Users
- **id** (number): Primary key, unique identifier for each user.
- **username** (string): Username of the user.
- **email** (string): Email address of the user.
- **role** (string): Role of the user (e.g., "admin", "user").

#### Resources
- **id** (number): Primary key, unique identifier for each resource.
- **title** (string): Title of the resource.
- **url** (string): URL or location of the resource.
- **topicId** (number): Foreign key, references `Topics.id`.

## Getting Started

Follow these steps to set up and run the DynKB system.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/dynkb.git
   cd dynkb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following environment variables:
   ```
   PORT=3000
   DB_PATH=./db/database.json
   ```

4. Ensure the database file exists at the specified path (`db/database.json`). If it doesn't exist, create it with the following structure:
   ```json
   {
     "topics": [],
     "users": [],
     "resources": []
   }
   ```

### Running the Server

Start the server with the following command:
```bash
npm start
```

The server will run on `http://localhost:3000`.

### Running the Tests

The DynKB system includes a suite of unit tests for the `userService`, `topicService`, and `resourceService`. To run the tests, follow these steps:

1. Install the required testing dependencies:
   ```bash
   npm install mocha chai sinon @types/chai @types/sinon --save-dev
   ```

2. Add the following script to your `package.json`:
   ```json
   "scripts": {
     "test": "mocha -r ts-node/register test/**/*.test.ts"
   }
   ```

3. Run the tests using:
   ```bash
   npm test
   ```

4. To use a separate test database (to avoid modifying the production database), set the `DB_PATH` environment variable:
   ```bash
   DB_PATH=db/test-database.json npm test
   ```

The tests will validate the functionality of the services, ensuring they work as expected.

## API Documentation

The DynKB system exposes the following RESTful API endpoints:

### Topics

- **GET /api/topics**: Retrieve all topics.
- **POST /api/topics**: Add a new topic.
  - Request body:
    ```json
    {
      "name": "Example Topic",
      "description": "This is an example topic."
    }
    ```
- **GET /api/recursive/topic/:id**: Retrieve a topic and its recursive children.
  - Parameters:
    - `id` (number): The ID of the topic to fetch.
  - Example response:
    ```json
    {
      "id": 1,
      "name": "Topic 1",
      "description": "This is Topic 1.",
      "children": [
        {
          "id": 2,
          "name": "Topic 2",
          "description": "This is Topic 2.",
          "children": []
        }
      ]
    }
    ```
- **GET /api/path/:id1/:id2**: Find the shortest path between two topics.
  - Parameters:
    - `id1` (number): The ID of the starting topic.
    - `id2` (number): The ID of the destination topic.
    - `expand` (optional, boolean): If `true`, returns full topic objects instead of IDs.
  - Example response (without `expand`):
    ```json
    {
      "path": [1, 3, 5]
    }
    ```
  - Example response (with `expand=true`):
    ```json
    {
      "path": [
        { "id": 1, "name": "Topic 1", "description": "This is Topic 1." },
        { "id": 3, "name": "Topic 3", "description": "This is Topic 3." },
        { "id": 5, "name": "Topic 5", "description": "This is Topic 5." }
      ]
    }
    ```

### Users

- **GET /api/users**: Retrieve all users.
- **POST /api/users**: Add a new user.
  - Request body:
    ```json
    {
      "username": "johndoe",
      "email": "johndoe@example.com",
      "role": "user"
    }
    ```

### Resources

- **GET /api/resources**: Retrieve all resources.
- **POST /api/resources**: Add a new resource.
  - Request body:
    ```json
    {
      "title": "Example Resource",
      "url": "http://example.com",
      "topicId": 1
    }
    ```

## Code Documentation

The system is organized into the following components:

### Models

- **Database**: Defines the shape of the database (`topics`, `users`, `resources`).

### Controllers

- **Database Loader**: Handles loading and saving data to the JSON file.

### Routes

- **Topics Routes**:
  - `GET /api/topics`: Fetch all topics.
  - `POST /api/topics`: Add a new topic.
  - `GET /api/recursive/topic/:id`: Fetch a topic and its recursive children.
  - `GET /api/path/:id1/:id2`: Find the shortest path between two topics.

- **Users Routes**:
  - `GET /api/users`: Fetch all users.
  - `POST /api/users`: Add a new user.

- **Resources Routes**:
  - `GET /api/resources`: Fetch all resources.
  - `POST /api/resources`: Add a new resource.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact

For questions or support, please contact [pedrofmj@gmail.com].

