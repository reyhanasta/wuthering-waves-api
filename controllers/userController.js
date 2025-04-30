// controllers/userController.js
import db from "../config/db.js"; // ES Module import

// GET all users
export const getAllUsers = async (req, res) => {
  // Renamed from showUserList
  try {
    // Select only necessary fields, excluding sensitive ones if any
    const [rows] = await db.query(
      "SELECT id, name, email, created_at FROM users"
    );
    // Send JSON response
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    // Send JSON error response
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// GET single user by ID
//explain line by line
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const [rows] = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      // Send 404 Not Found JSON response
      return res.status(404).json({ message: "User not found" });
    }
    // Send the single user as JSON
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

// POST - Create a new user
export const createUser = async (req, res) => {
  try {
    // Data comes from the JSON request body
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
    const [result] = await db.query(sql, [name, email]);

    // Send back information about the created user
    res.status(201).json({
      // 201 Created status
      message: "User created successfully",
      userId: result.insertId,
      name: name,
      email: email,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "Conflict: Email already exists" }); // 409 Conflict
    }
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

// PUT - Update a user by ID
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // Get updated data from JSON request body
    const { name, email } = req.body;

    // Validation: Check if at least one field to update is provided
    if (!name && !email) {
      return res
        .status(400)
        .json({ message: "Bad Request: Provide name or email to update" });
    }

    // Check if the user exists first (optional but good practice)
    const [userExists] = await db.query("SELECT id FROM users WHERE id = ?", [
      userId,
    ]);
    if (userExists.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Build query dynamically (safer than the previous simple version)
    const fieldsToUpdate = [];
    const values = [];
    if (name !== undefined) {
      fieldsToUpdate.push("name = ?");
      values.push(name);
    }
    if (email !== undefined) {
      fieldsToUpdate.push("email = ?");
      values.push(email);
    }

    if (fieldsToUpdate.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    values.push(userId); // Add the user ID for the WHERE clause

    const sql = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;

    const [result] = await db.query(sql, values);

    // No need to check affectedRows necessarily if we checked existence before
    // If affectedRows is 0 here, it might mean the data was the same

    // Fetch the updated user data to return it (optional)
    const [updatedUserRows] = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [userId]
    );

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUserRows[0], // Return updated user data
    });
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "Conflict: Email already exists" });
    }
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

// DELETE - Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists before deleting (optional)
    const [userExists] = await db.query("SELECT id FROM users WHERE id = ?", [
      userId,
    ]);
    if (userExists.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const sql = "DELETE FROM users WHERE id = ?";
    const [result] = await db.query(sql, [userId]);

    // Send success response, typically 204 No Content or 200 OK with a message
    // res.status(204).send(); // 204 No Content is common for DELETE
    res.status(200).json({ message: "User deleted successfully", id: userId });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};
