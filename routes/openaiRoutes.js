// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const { Readable } = require("stream");
// const { Configuration, OpenAIApi } = require("openai");
// require("dotenv").config();

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(config);

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// router.post("/generate", upload.single("audio"), async (req, res) => {
//   try {
//     const { buffer } = req.file;
//     const { data } = await openai.createTranscription(buffer, "whisper-1");
//     // const { data } = await openai.createTranscription({
//     //   file: {
//     //     value: buffer,
//     //     options: {
//     //       filename: "audio.webm",
//     //       contentType: "audio/webm",
//     //     },
//     //   },
//     //   model: "whisper-1",
//     // });

//     res.status(200).json({
//       message: "Successfully generated AI response",
//       data: data,
//     });
//   } catch (error) {
//     console.log(error.response.data);
//     res.status(500).json({
//       message: "Error whilst generating AI response",
//       error: error,
//     });
//   }
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const { Readable } = require("stream");

// const { Configuration, OpenAIApi } = require("openai");
// require("dotenv").config();

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(config);

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// router.post("/generate", upload.single("audio"), async (req, res) => {
//   try {
//     const { buffer } = req.file;

//     // Convert buffer to Readable stream
//     const readableStream = new Readable({
//       read() {
//         this.push(buffer);
//         this.push(null);
//       },
//     });

//     const { data } = await openai.createTranscription(
//       {
//         value: readableStream,
//         options: {
//           filename: "audio.webm",
//           contentType: "audio/webm",
//         },
//       },
//       "whisper-1"
//     );

//     res.status(200).json({
//       message: "Successfully generated AI response",
//       data: data,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Error whilst generating AI response",
//       error: error,
//     });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const util = require("util");
const path = require("path");

const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/whisper", upload.single("audio"), async (req, res) => {
  try {
    const { buffer } = req.file;

    // Save buffer to a temporary file
    const tempFilePath = path.join(__dirname, "temp_audio.webm");
    await util.promisify(fs.writeFile)(tempFilePath, buffer);

    // Create a read stream from the temporary file
    const fileStream = fs.createReadStream(tempFilePath);

    const { data } = await openai.createTranscription(fileStream, "whisper-1");

    // Delete the temporary file
    await util.promisify(fs.unlink)(tempFilePath);

    console.log(data);
    res.status(200).json({
      message: "Successfully converted speech to text",
      whisper: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error whilst converting speech to text",
      error: error,
    });
  }
});

router.post("/generate", async (req, res) => {
  try {
    const messages = req.body.messages;

    const { data } = await openai.createChatCompletion({
      //   model: "gpt-3.5-turbo",
      model: "gpt-4",
      messages: messages,
    });

    // respond with the data from the OpenAI API call
    res.json({ response: data.choices[0].message.content });
    console.log(data.choices[0].message.content);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error whilst trying to generate AI response",
      details: error.message,
    });
  }
});

module.exports = router;
