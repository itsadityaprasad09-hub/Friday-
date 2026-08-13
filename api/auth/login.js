// Starts the GitHub OAuth flow — redirects the user to GitHub's login/approve screen.

export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `https://${req.headers.host}/api/auth/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user',
    allow_signup: 'false'
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}
