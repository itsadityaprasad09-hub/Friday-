// GitHub redirects here after the user approves.
// Exchanges the temporary code for an access token and stores it in a
// secure, httpOnly cookie — the browser JS never sees the raw token.

export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) {
    return res.redirect('/?connect_error=1');
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error('GitHub token exchange failed:', tokenData);
      return res.redirect('/?connect_error=1');
    }

    // Store token in an httpOnly, secure cookie (30 days).
    // httpOnly = JavaScript in the browser cannot read it — safer against XSS.
    res.setHeader('Set-Cookie', [
      `gh_token=${tokenData.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
    ]);

    res.redirect('/?connected=github');
  } catch (err) {
    console.error(err);
    res.redirect('/?connect_error=1');
  }
}
