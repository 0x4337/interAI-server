const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const openai = require("openai");
require("dotenv").config();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/generate", async (req, res) => {
  try {
    const { buffer } = req.file;
    const { data } = await openai.createTranscript({
      file: buffer,
      model: "whisper-1",
    });

    res.status(200).json({
      message: "Successfully generated AI response",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error whilst generating AI response",
      error: error,
    });
  }
});
