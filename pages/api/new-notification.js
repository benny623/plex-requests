import ReactDOMServer from "react-dom/server";
import { Resend } from "resend";
import NewEmail from "@/components/new-email";

export default async function handler(req, res) {
  const { title, type, email, optional } = req.body;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const htmlContent = ReactDOMServer.renderToStaticMarkup(
      <NewEmail
        title={title}
        year={optional.year || ""}
        type={type}
        email={email}
        image={optional.image || ""}
      />
    );

    const send = await resend.emails.send({
      from: "PlexRequest Notification <notification@dwsrequests.site>",
      to: [process.env.TEMP_EMAIL, process.env.TEMP_EMAIL2],
      subject: `New Request: ${title}`,
      html: htmlContent,
    });

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
