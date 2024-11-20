import NodeMailer from "nodemailer";
import { fetchSingleRequest } from "@/lib/fetchRequests";

export default async function handler(req, res) {
  const { status, id, title } = req.body;

  function statusColor(status) {
    switch (status) {
      case "New":
        return "#ff52d9";
      case "In Progress":
        return "#7480ff";
      case "Pending":
        return "#ffbe00";
      case "Complete":
        return "#00a96e";
      default:
        return "";
    } // The colors here are subject to change depending on if the theme changes
  }

  const transporter = NodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Grab the email from the backend so email is not exposed in json body
    const emailData = await fetchSingleRequest(id);

    if (!emailData || !emailData[0].request_requestor) {
      throw new Error("Email not found");
    }

    // Verify transporter connection before sending notification
    await transporter.verify();

    const mailOptions = {
      from: "PlexRequest Notification <bm.contact623@gmail.com>",
      to: emailData[0].request_requestor,
      subject: `${title} Status Change`,
      html: `
      <h1>Status for ${title} has changed!</h1>
      <h2>New Status: <span style="border: 3px solid ${statusColor(
        status
      )}; border-radius: 5px;">${status}</span></h2>
      `, // TODO: add CSS to make this look nicer
    };

    // Send notification
    await transporter.sendMail(mailOptions);

    // Send success response after email is sent
    return res.status(200).json({
      status: "send success",
      //data: send,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      status: "send fail",
      message: err.message,
    });
  }
}
