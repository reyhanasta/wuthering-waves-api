# Node.js MySQL REST API for Users & Characters

## Description

This project provides a simple RESTful API built with Node.js, Express.js, and MySQL. It allows you to perform CRUD (Create, Read, Update, Delete) operations on 'users' and 'characters' resources, returning data in JSON format. The project uses modern JavaScript (ES Modules) syntax.

## Features

- RESTful API endpoints for Users and Characters.
- CRUD operations for both resources.
- Uses Express.js for routing and middleware.
- Connects to a MySQL database using the `mysql2` driver (with Promises).
- Uses ES Module syntax (`import`/`export`).
- Environment variables managed with `dotenv`.
- Returns data in JSON format.
- Includes JOINs to fetch related data (e.g., weapon/rarity names for characters).

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js) or [yarn](https://yarnpkg.com/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) running locally or accessible.

## Installation & Setup

1.  **Clone the Repository (if applicable):**

    ```bash
    # If your project is in a Git repository
    git clone <your-repository-url>
    cd <your-project-directory>
    ```

    _If not using Git, simply navigate to your project directory._

2.  **Install Dependencies:**

    ```bash
    npm install
    # or if using yarn:
    # yarn install
    ```

3.  **Database Setup:**

    - Connect to your MySQL server.
    - Create the database if it doesn't exist (e.g., `my_api_db`):
      ```sql
      CREATE DATABASE my_api_db;
      USE my_api_db;
      ```
    - Create the necessary tables using the schemas below:

      **`users` Table:**

      ```sql
      CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      ```

      **`weapons` Table:** (Example structure)

      ```sql
      CREATE TABLE weapons (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL
          -- Add other weapon-related columns if needed
      );
      ```

      **`rarities` Table:** (Example structure)

      ```sql
      CREATE TABLE rarities (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL
          -- Add other rarity-related columns if needed
      );
      ```

      **`characters` Table:** (References `weapons` and `rarities`)

      ```sql
      CREATE TABLE characters (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE,
          attribute VARCHAR(100),
          weapon INT,              -- Foreign key to weapons.id
          rarity INT,              -- Foreign key to rarities.id
          specifications TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (weapon) REFERENCES weapons(id) ON DELETE SET NULL ON UPDATE CASCADE,
          FOREIGN KEY (rarity) REFERENCES rarities(id) ON DELETE SET NULL ON UPDATE CASCADE
          -- Add indexes for performance if needed, e.g.:
          -- INDEX (weapon),
          -- INDEX (rarity)
      );
      ```

      _(Note: `ON DELETE SET NULL` means if a weapon/rarity is deleted, the character's reference becomes NULL. Adjust as needed, e.g., `RESTRICT`)_

    - (Optional but Recommended) Create a dedicated MySQL user with permissions for this database.

4.  **Configure Environment Variables:**

    - Create a file named `.env` in the root of the project directory.
    - Copy the contents of `.env.example` (if you create one) or use the template below and fill in your actual database credentials:

      ```dotenv
      # .env file contents
      DB_HOST=localhost
      DB_USER=your_mysql_username
      DB_PASSWORD=your_mysql_password
      DB_NAME=my_api_db
      API_PORT=3000
      ```

    - **Important:** Replace placeholders with your actual configuration. Never commit your `.env` file to version control (add it to `.gitignore`).

## Running the Application

1.  **Development Mode (with automatic restarts using Nodemon):**

    - Make sure Nodemon is installed (`npm install -g nodemon` or add to devDependencies `npm install --save-dev nodemon`).
    - Add a script to your `package.json` if you haven't already:
      ```json
      "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js"
      }
      ```
    - Run the development server:
      ```bash
      npm run dev
      ```

2.  **Production Mode:**
    ```bash
    npm start
    # or directly:
    # node index.js
    ```

The API server will start, typically on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

The base URL for all API endpoints is `http://localhost:3000/api` (assuming `API_PORT=3000`).

### Users (`/api/users`)

| Method | Path   | Description             | Request Body (JSON)           | Success Response (JSON)                           | Error Response (JSON)                                                           |
| :----- | :----- | :---------------------- | :---------------------------- | :------------------------------------------------ | :------------------------------------------------------------------------------ |
| GET    | `/`    | Get a list of all users | -                             | `200 OK` - Array of user objects                  | `500 Internal Server Error`                                                     |
| POST   | `/`    | Create a new user       | `{ "name": "", "email": "" }` | `201 Created` - Details of the created user       | `400 Bad Request`, `409 Conflict`, `500 Internal Server Error`                  |
| GET    | `/:id` | Get a single user by ID | -                             | `200 OK` - Single user object                     | `404 Not Found`, `500 Internal Server Error`                                    |
| PUT    | `/:id` | Update a user by ID     | `{ "name": "", "email": "" }` | `200 OK` - Details of the updated user            | `400 Bad Request`, `404 Not Found`, `409 Conflict`, `500 Internal Server Error` |
| DELETE | `/:id` | Delete a user by ID     | -                             | `200 OK` `{ "message": ... }` or `204 No Content` | `404 Not Found`, `500 Internal Server Error`                                    |

### Characters (`/api/characters`)

| Method | Path   | Description                       | Request Body (JSON)                                                                    | Success Response (JSON)                                              | Error Response (JSON)                                           |
| :----- | :----- | :-------------------------------- | :------------------------------------------------------------------------------------- | :------------------------------------------------------------------- | :-------------------------------------------------------------- |
| GET    | `/`    | Get a list of all characters (\*) | -                                                                                      | `200 OK` - Array of character objects (with names for weapon/rarity) | `500 Internal Server Error`                                     |
| POST   | `/`    | Create a new character            | `{ "name": "", "slug": "", "attribute": "", "weapon": ID, "rarity": ID, "specs": "" }` | `201 Created` - Details of the created character                     | `400 Bad Request`, `500 Internal Server Error`                  |
| GET    | `/:id` | Get a single character by ID      | -                                                                                      | `200 OK` - Single character object (with names for weapon/rarity)    | `404 Not Found`, `500 Internal Server Error`                    |
| PUT    | `/:id` | Update a character by ID          | `{ "name": "", "slug": "", "attribute": "", "weapon": ID, "rarity": ID, "specs": "" }` | `200 OK` - Details of the updated character (with names)             | `400 Bad Request`, `404 Not Found`, `500 Internal Server Error` |
| DELETE | `/:id` | Delete a character by ID          | -                                                                                      | `200 OK` `{ "message": ... }` or `204 No Content`                    | `404 Not Found`, `500 Internal Server Error`                    |

(\*) Note: Assumes the `GET /api/characters` endpoint is also implemented using JOINs to return `weapon_name` and `rarity_name` similar to `GET /api/characters/:id`. Adjust the documentation if it returns IDs instead.

## Technologies Used

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [mysql2](https://github.com/sidorares/node-mysql2) (MySQL driver)
- [dotenv](https://github.com/motdotla/dotenv) (Environment variable management)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue.

## License

This project is licensed under the MIT License.
