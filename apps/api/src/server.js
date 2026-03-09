import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

app.get("/", (req, res) => {
  res.send("API running...");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
