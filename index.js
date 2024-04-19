import express from 'express'
import bodyParser from 'body-parser'
import sgMail from '@sendgrid/mail'
import cors from 'cors'
import nodemailer from 'nodemailer'
import axios from 'axios'

const app = express();
const PORT = 5000;

sgMail.setApiKey('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');
app.use(cors());
app.use(bodyParser.json());

async function downloadFile(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data;
    } catch (error) {
        console.error("Error downloading file:", error);
        throw error;
    }
}

async function sendEmailWithAttachment(to, downloadURL) {
    try {
        const fileContent = await downloadFile(downloadURL);
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "muhammad.451237@gmail.com",
                pass: "upzpeswiszrsrign",
            }
        });
        const emailOption = {
            from: "muhammad.451237@gmail.com",
            to: to,
            subject: `Candidate resume`,
            html: `<strong>Click below to download your PDF:</strong><br><a href="${downloadURL}">Download PDF</a>`,
            attachments: [{
                content: fileContent,
                filename: 'file.pdf',
                type: 'application/pdf',
                disposition: 'attachment'
            }]
        };
        await transporter.sendMail(emailOption);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

app.post('/send-email', async (req, res) => sendEmailWithAttachment(req.body.to, req.body.downloadURL));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});