import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import characterRouter from "./routes/characterRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
// Crucial: Middleware to parse JSON request bodies for POST/PUT
app.use(express.json());
// Optional: Middleware for URL-encoded data (if clients might send it)
app.use(express.urlencoded({ extended: true }));
// --- End Middleware ---

// Base API route (optional)
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Basic Node.js MySQL API!" });
});

// Mount the user routes under the /api/users path (standard for APIs)
app.use("/api/users", userRouter); // Use the imported router
app.use("/api/characters", characterRouter); // Use the imported router

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : null,
  });
  // Optionally, you can send a more detailed error message in development mode
}); // Error handling middleware
app.listen(PORT, () => {
  // Make sure db connection message still appears (it runs when db.js is imported)
  console.log(
    `JSON API Server running using ES Modules on http://localhost:${PORT}`
  );
});
