// /api/upload.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { IncomingForm } = await import('formidable');
  const fs = await import('fs');
  const fetch = (await import('node-fetch')).default;

  const form = new IncomingForm({ multiples: true, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Form parsing error" });

    const webhookUrl = "https://canary.discord.com/api/webhooks/1365282819646947409/YLfOxbOuLrQ6AHYb0_bImraprcO6VxmcoIbM4Sz2r9z_fIvuZiLED3TUIIDZCeQszc_u";

    const payload = JSON.parse(fields.payload_json);
    const attachments = Object.values(files).map((file, index) => ({
      name: file.originalFilename,
      file: fs.createReadStream(file.filepath)
    }));

    const formData = new (await import('form-data'))();
    formData.append("payload_json", JSON.stringify(payload));
    attachments.forEach((att, i) => {
      formData.append(`files[${i}]`, att.file, att.name);
    });

    const response = await fetch(webhookUrl, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to send to Discord" });
    }

    res.status(200).json({ success: true });
  });
}

export const config = {
  api: {
    bodyParser: false
  }
};
