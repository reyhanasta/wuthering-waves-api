// routes/userRoutes.js
import express from "express";
// Import the controller functions we need
import * as characterController from "../controllers/characterController.js"; // Adjust the path as necessary
// Import the database connection (if needed, but not used in this file)

const router = express.Router();

// Setup routes for /api/users (or just /users if mounted under /api in index.js)
router.get("/", characterController.getAllCharacters); // GET /api/users -> Get all users
router.post("/", characterController.createCharacter); // POST /api/users -> Create a new user

router.get("/:id", characterController.getCharacterById); // GET /api/users/:id -> Get a single user by ID
// router.put("/:id", characterController.updateUser); // PUT /api/users/:id -> Update a user by ID
router.delete("/:id", characterController.deleteCharacter); // DELETE /api/users/:id -> Delete a user by ID

// Use export default for the router
export default router;
