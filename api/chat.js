// This runs on Vercel's server, NOT in the browser.
// The API key stays hidden here — never exposed to the user.
// Using Google Gemini API (free tier)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(500).json({ error: 'Friday could not respond right now.' });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
    return res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
}
