const express = require("express");
const cors = require("cors");
const openaiRoutes = require("./routes/openaiRoutes");
const elevenlabsRoutes = require("./routes/elevenlabsRoutes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/openai", openaiRoutes);
app.use("/api/elevenlabs", elevenlabsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
