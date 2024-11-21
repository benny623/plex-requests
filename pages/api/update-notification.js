import NodeMailer from "nodemailer";
import { fetchSingleRequest } from "@/lib/fetchRequests";

export default async function handler(req, res) {
  const { id } = req.body; // TODO: refactor this to only need ID. This will involve changing the values below to grab title and status for the email

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

    // Verify transporter connection before sending notification
    await transporter.verify();

    const mailOptions = {
      from: "PlexRequest Notification <bm.contact623@gmail.com>",
      to: emailData[0].request_requestor,
      subject: `${emailData[0].request_title} Update!`,
      html: `
      <h2>Here is an update on your request for: ${emailData[0].request_title}</h2>
      <h2>Status: <span style="border: 3px solid ${statusColor(
        emailData[0].request_status
      )}; border-radius: 5px;">
      ${emailData[0].request_status}
      </span></h2>
      ${!emailData[0].request_note ? "" : `<h2>Note: ${emailData[0].request_note}</h2>` }
      `, // TODO: add CSS to make this look nicer
    };

    // Send notification
    await transporter.sendMail(mailOptions);

    // Send success response after email is sent
    return res.status(200).json({
      status: "send success",
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      status: "send fail",
      message: err.message,
    });
  }
}
