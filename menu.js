/* /api/menu.js — função serverless do Vercel
   GET  -> devolve o menu atual (público, qualquer visitante pode ler)
   PUT  -> grava um novo menu (só se vier com a password correta no cabeçalho
           Authorization, verificada aqui no servidor contra a variável de
           ambiente HOST_PASSWORD_HASH — nunca fica exposta no código do site)

   Variáveis de ambiente necessárias no Vercel (Project Settings -> Environment Variables):
     JSONBIN_ID          -> o ID do "bin" criado em jsonbin.io
     JSONBIN_KEY         -> a "X-Master-Key" (ou "Access Key") da tua conta jsonbin.io
     HOST_PASSWORD_HASH  -> d6db2c3c05e8ad72b65a4270de7e930a5f14c5b91cb585abd0110e11ce581c31
*/

module.exports = async function handler(req, res) {
  const JSONBIN_ID = process.env.JSONBIN_ID;
  const JSONBIN_KEY = process.env.JSONBIN_KEY;
  const HOST_HASH = process.env.HOST_PASSWORD_HASH;

  if (!JSONBIN_ID || !JSONBIN_KEY) {
    res.status(500).json({ error: "Configuração em falta no servidor (JSONBIN_ID / JSONBIN_KEY)." });
    return;
  }

  if (req.method === "GET") {
    try {
      const r = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
        headers: { "X-Master-Key": JSONBIN_KEY }
      });
      if (!r.ok) throw new Error("jsonbin GET falhou");
      const data = await r.json();
      res.status(200).json(data.record);
    } catch (e) {
      res.status(500).json({ error: "Erro ao ler o menu." });
    }
    return;
  }

  if (req.method === "PUT") {
    const auth = req.headers["authorization"] || "";
    const providedHash = auth.replace("Bearer ", "").trim();

    if (!HOST_HASH || providedHash !== HOST_HASH) {
      res.status(401).json({ error: "Não autorizado." });
      return;
    }

    try {
      const r = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": JSONBIN_KEY
        },
        body: JSON.stringify(req.body)
      });
      if (!r.ok) throw new Error("jsonbin PUT falhou");
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: "Erro ao guardar o menu." });
    }
    return;
  }

  res.status(405).json({ error: "Método não suportado." });
};
