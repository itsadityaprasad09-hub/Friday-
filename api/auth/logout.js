// Disconnects GitHub by clearing the cookie.

export default function handler(req, res) {
  res.setHeader('Set-Cookie', 'gh_token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
  res.status(200).json({ disconnected: true });
}
