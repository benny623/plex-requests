import ReactDOMServer from "react-dom/server";
import { Resend } from "resend";
import UpdateEmail from "@/components/update-email";

import { fetchSingleRequest } from "@/lib/fetchRequests";
import { checkAdmin } from "@/lib/helpers";

export default async function handler(req, res) {
  const { id } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from auth headers

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const isAdmin = await checkAdmin(token);

  if (!isAdmin || !token) {
    return res.status(405).json({ error: "Unauthorized" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Grab the email from the backend so email is not exposed in json body
    const emailData = await fetchSingleRequest(id, token);

    // Generate email HTML
    const htmlContent = ReactDOMServer.renderToStaticMarkup(
      <UpdateEmail
        title={emailData[0].request_title}
        status={emailData[0].request_status}
        note={emailData[0].request_note}
        image={emailData[0].request_optional.image || ""}
      />
    );

    // Send notification
    const send = await resend.emails.send({
      from: "PlexRequest Notification <notification@dwsrequests.site>",
      to: emailData[0].request_requestor,
      subject: `${emailData[0].request_title} Update!`,
      html: htmlContent,
    });

    // Send success response after email is sent
    return res.status(200).json({
      status: "send success",
      data: send,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      status: "send fail",
      message: err.message,
    });
  }
}
