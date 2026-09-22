import express from "express";

const app = express();
app.use(express.json());

app.all("*", (req, res) => {
  res.json({ ok: true, message: "SiteFlow API Serverless Endpoint", url: req.url });
});

export default app;
