export default async function handler(req, res) {
  const renderUrl = "https://pingnotes-backend.vercel.app/";
  try {
    const ping = await fetch(renderUrl);
    const text = await ping.text();
    res.status(200).json({ status: "ok", response: text });
  } catch (e) {
    res.status(500).json({ status: "error", error: e.message });
  }
}
