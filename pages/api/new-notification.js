import ReactDOMServer from "react-dom/server";
import NodeMailer from "nodemailer";
import { NewEmail } from "@/components/new-email";

export default async function handler(req, res) {
  const { title, year, type, email, image } = req.body;

  const htmlContent = ReactDOMServer.renderToStaticMarkup(
    <NewEmail
      title={title}
      year={year}
      type={type}
      email={email}
      image={image}
    />
  );

  const transporter = NodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Verify transporter connection before sending notification
    await transporter.verify();

    const mailOptions = {
      from: "PlexRequest Notification <bm.contact623@gmail.com>",
      to: [process.env.TEMP_EMAIL, process.env.TEMP_EMAIL2], // TODO: after userauth and admin side set up, change this to only be for the admin emails
      subject: `New Request: ${title}`,
      html: htmlContent,
    };

    // Send notification
    const send = await transporter.sendMail(mailOptions);

    // Send success response after email is sent
    return res.status(200).json({
      status: "success",
      data: send,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
}
