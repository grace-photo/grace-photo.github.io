import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm({ multiples: true });
  form.uploadDir = '/tmp';
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Form parsing error' });

    const webhookUrl = "https://canary.discord.com/api/webhooks/1365282819646947409/YLfOxbOuLrQ6AHYb0_bImraprcO6VxmcoIbM4Sz2r9z_fIvuZiLED3TUIIDZCeQszc_u";

    const images = Array.isArray(files.images) ? files.images : [files.images];
    const attachments = images.map((file, index) => ({
      name: `image${index}.jpg`,
      file: fs.createReadStream(file.filepath),
    }));

    const formData = new FormData();
    attachments.forEach((attachment, i) => {
      formData.append(`file${i}`, attachment.file, attachment.name);
    });

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed: ${response.statusText}`);
      return res.status(200).json({ message: 'Sent to Discord' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });
}