// Tells the frontend whether GitHub is connected, without ever exposing the token itself.

function getCookie(req, name) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;
  const match = cookies.split(';').map(c => c.trim()).find(c => c.startsWith(name + '='));
  return match ? match.split('=')[1] : null;
}

export default async function handler(req, res) {
  const token = getCookie(req, 'gh_token');
  if (!token) {
    return res.status(200).json({ github: null });
  }

  try {
    const userRes = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!userRes.ok) {
      return res.status(200).json({ github: null });
    }
    const user = await userRes.json();
    return res.status(200).json({ github: { username: user.login } });
  } catch (err) {
    return res.status(200).json({ github: null });
  }
}
