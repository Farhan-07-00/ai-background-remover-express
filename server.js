require("dotenv").config();

const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");

const app = express();

app.use(cors());

const upload = multer({
    storage: multer.memoryStorage(),
});
app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

app.post(
    "/remove-bg",
    upload.single("image_file"),
    async (req, res) => {

        try {

            const formData = new FormData();

            formData.append(
                "image_file",
                req.file.buffer,
                req.file.originalname
            );

            const response = await axios.post(
                "https://api.remove.bg/v1.0/removebg",
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        "X-Api-Key":
                            process.env.REMOVE_BG_API_KEY,
                    },
                    responseType: "arraybuffer",
                }
            );

            res.set(
                "Content-Type",
                "image/png"
            );

            res.send(response.data);

        } catch (error) {

            console.error(error.response?.data || error.message);

            res.status(500).json({
                error:
                    "Failed to remove background",
            });

        }

    }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});