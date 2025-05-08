
import { IncomingForm } from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({ multiples: true, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Form parsing error' });
    }

    const webhookUrl = 'https://discord.com/api/webhooks/1365282819646947409/YLfOxbOuLrQ6AHYb0_bImraprcO6VxmcoIbM4Sz2r9z_fIvuZiLED3TUIIDZCeQszc_u';

    const payload = JSON.parse(fields.payload_json);
    const attachments = Object.values(files).map((file) => ({
      name: file.originalFilename,
      file: fs.createReadStream(file.filepath),
    }));

    const formData = new FormData();
    formData.append('payload_json', JSON.stringify(payload));
    attachments.forEach((att, i) => {
      formData.append(`files[${i}]`, att.file, att.name);
    });

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        return res.status(500).json({ error: 'Failed to send to Discord' });
      }

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Unexpected error occurred' });
    }
  });
}
