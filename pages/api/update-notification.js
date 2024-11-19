import NodeMailer from "nodemailer";

export default async function handler(req, res) {
  const { status, title, email } = req.body;

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
      to: email,
      subject: `${title} Status Change`,
      html: `
      <h1>The Status for ${title} has changed!</h1>
      <h2>New Status: ${status}</h2>
      `, // TODO: add CSS to make this look nicer
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
