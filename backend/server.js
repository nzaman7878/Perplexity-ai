import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import dotenv from "dotenv";


dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB().catch((err) => {
  console.error("Failed to connect to the database:", err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
