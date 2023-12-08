require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");

//MongoDb Connection
connectDB();

//middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
//Authentication route
app.use("/api/v1/auth", require("./routes/userRoutes"));

//File Handle route
app.use("/api/v1/file", require("./routes/fileRoutes"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
