import NodeMailer from "nodemailer";

export default async function handler(req, res) {
  const { title, user } = req.body; // TODO: email doesn't need to be here, find a better way of grabbing admin emails within this call

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
      to: process.env.TEMP_EMAIL,
      subject: `New Request: ${title}`,
      text: `
      New Request from ${user}

      ${title}
      `,
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
