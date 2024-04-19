import express from 'express'
import bodyParser from 'body-parser'
import sgMail from '@sendgrid/mail'
import cors from 'cors'
import nodemailer from 'nodemailer'

const app = express();
const PORT = 5000;

// Set your SendGrid API key from environment variable
sgMail.setApiKey('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');

app.use(cors());
app.use(bodyParser.json());

// POST endpoint to send an email
app.post('/send-email', async (req, res) => {
    // try {
    //     // const { downloadURL, to } = req.body;
    //     const downloadURL = "https://example.com/file.pdf";
    //     const msg = {
    //         to: "abdullah.320409@gmail.com",  // Change to your recipient
    //         from: 'invites@screenshottime.com',  // Change to your verified sender
    //         subject: 'Your PDF File',
    //         text: 'Here is the PDF file you requested.',
    //         html: `<strong>Click below to download your PDF:</strong><br><a href="${downloadURL}">Download PDF</a>`,
    //         attachments: [{
    //             content: Buffer.from(downloadURL, 'utf-8').toString('base64'),
    //             filename: 'file.pdf',
    //             type: 'application/pdf',
    //             disposition: 'attachment'
    //         }]
    //     };
    //     await sgMail.send(msg);
    //     return res.status(200).json({ success: true, message: 'Email sent successfully' });
    // } catch (error) {
    //     console.error(error.toString());
    //     res.status(500).send('Failed to send email');
    // }
    const { downloadURL, to } = req.body;
    const emailConfig = {
        service: "gmail",
        auth: {
            user: "muhammad.451237@gmail.com",
            pass: "upzpeswiszrsrign",
        }
    };
    const transporter = nodemailer.createTransport(emailConfig);
    var emailOption = {
        from: "indeed@gmail.com",
        to: to,
        subject: `Candidate resume`,
        html: `<strong>Click below to download your PDF:</strong><br><a href="${downloadURL}">Download PDF</a>`,
        attachments: [{
            content: Buffer.from(downloadURL, 'utf-8').toString('base64'),
            filename: 'file.pdf',
            type: 'application/pdf',
            disposition: 'attachment'
        }]
    }
    try {
        await transporter.sendMail(emailOption);
        res.status(200).json({ message: "email sent successfully", status: true })
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});