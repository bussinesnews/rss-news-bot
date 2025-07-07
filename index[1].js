const express = require('express');
const Parser = require('rss-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

const parser = new Parser();
const apiKey = "a87bc489885dc175cf5e2092e78a4562";
const userId = "455400";

app.get("/", async (req, res) => {
  try {
    const feed = await parser.parseURL('https://rss.cnn.com/rss/edition.rss');
    let html = `<h2>📰 Noticias destacadas</h2>`;

    for (const item of feed.items.slice(0, 5)) {
      const titulo = item.title;
      const originalUrl = item.link;

      const apiUrl = `https://bc.vc/api/api.php?key=${apiKey}&uid=${userId}&link=${encodeURIComponent(originalUrl)}`;
      const r = await axios.get(apiUrl);
      const shortUrl = r.data;

      html += `
        <div style="padding:10px; margin:10px; border-bottom:1px solid #ccc;">
          <h4>${titulo}</h4>
          <a href="${shortUrl}" target="_blank" style="color:blue;">Leer más</a>
        </div>
      `;
    }

    res.send(html);
  } catch (err) {
    res.send("❌ Error: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor activo en http://localhost:${PORT}`);
});
