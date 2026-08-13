// This runs on Vercel's server, NOT in the browser.
// The API key stays hidden here — never exposed to the user.
// Using NVIDIA NIM (free tier) with GLM-5.2

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'zai-org/glm-5.2',
        messages: [{ role: 'user', content: message }],
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('NVIDIA API error:', data);
      return res.status(500).json({ error: 'Friday could not respond right now.' });
    }

    const reply = data.choices?.[0]?.message?.content || 'No response received.';
    return res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
}
