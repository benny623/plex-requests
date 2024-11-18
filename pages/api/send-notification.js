import NodeMailer from "nodemailer";

export default async function handler(req, res) {
  const transporter = NodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify((err, success) => {
    err
      ? console.error(err)
      : console.log(`Server is ready to take messages: ${success}`);
  });

  const mailOptions = {
    from: "Plex Request Notification <bm.contact623@gmail.com>",
    to: "bmilner88@gmail.com",
    subject: "Test Notification",
    text: "this is a test plex request notification",
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        status: "fail",
        message: err,
      });
    }

    console.log("Notification sent");
    res.status(250).json({
      status: "success",
      data: data,
    });
  });
}
