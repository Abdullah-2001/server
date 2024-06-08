import express from "express";
import bodyParser from "body-parser";
import sgMail from "@sendgrid/mail";
import cors from "cors";
import nodemailer from "nodemailer";
import axios from "axios";
import multer from "multer";

const upload = multer();

const app = express();
const PORT = 5000;

sgMail.setApiKey(
  "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"
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

async function downloadFile(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return response.data;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}

async function sendEmailWithAttachment(body, req) {
    console.log(body);
    console.log(req.file); // Accessing file from req object
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "muhammad.451237@gmail.com",
                pass: "upzpeswiszrsrign",
            },
        });

        const emailOption = {
            from: "muhammad.451237@gmail.com",
            to: body.email,
            subject: `Test`,
            html: `
              <h1>First Name: ${body.firstName}</h1>
              <h1>Last Name: ${body.lastName}</h1>
              <h1>Organization: ${body.organization}</h1>
              <h1>Title: ${body.title}</h1>
              <h1>Email: ${body.email}</h1>
              <h1>Phone Number: ${body.phoneNumber}</h1>
              <h1>Description: ${body.description}</h1>
              `,
            attachments: [
                {
                    filename: req.file.originalname,
                    content: req.file.buffer, // Using file buffer directly from req.file
                    contentType: req.file.mimetype,
                },
            ],
        };

        await transporter.sendMail(emailOption);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

app.post("/send-email", upload.single("file"), async (req, res) => {
    const { body } = req;
    await sendEmailWithAttachment(body, req); // Pass req object to the function
    res.status(200).send("Email sent successfully");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
