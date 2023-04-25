const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();

router.post("/speech", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await axios.post(
      "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM",
      {
        text: text,
        voice_settings: {
          stability: 0,
          similarity_boost: 0,
        },
      },
      {
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const audioData = Buffer.from(response.data, "binary").toString("base64");

    res.status(200).json({
      message: "Successfully generated text-to-speech",
      audio_data: audioData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error whilst trying to generate text-to-speech",
      details: error.message,
    });
  }
});

module.exports = router;
