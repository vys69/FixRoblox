import { Router } from 'express';
import { fetchRobloxUserData, fetchRobloxFriends, fetchRobloxFollowers, fetchRobloxAvatar } from './api';

const router = Router();

const page = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fix Roblox</title>
  <meta property="og:title" content="Fix Roblox">
  <meta property="og:description" content="Fix Roblox embeds">
  <meta property="og:image" content="https://fixroblox.com/assets/logo.png">
  <meta property="og:url" content="https://fixroblox.com">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Fix Roblox">
  <meta name="twitter:description" content="Fix Roblox embeds">
  <meta name="twitter:image" content="https://fixroblox.com/assets/logo.png">
</head>
<body style="background-color: #121212; color: #FFFFFF; font-family: helvetica, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
  <h1>roblox embeds suck... 🤮🤧</h1>
</body>
</html>
`;




router.get('/', (req, res) => {
  return res.send(page);
});

router.get('/users/:userId/profile', async (req, res) => {
  const userId = req.params.userId;

  try {
    const [userData, friendsData, followersData, avatarUrl] = await Promise.all([
      fetchRobloxUserData(userId),
      fetchRobloxFriends(userId),
      fetchRobloxFollowers(userId),
      fetchRobloxAvatar(userId)
    ]);

    const metaTags = `
      <meta property="og:title" content="${userData.displayName} (@${userData.name})">
      <meta property="og:description" content="${userData.description || 'No description available'}">
      <meta property="og:image" content="${avatarUrl}">
      <meta property="og:url" content="https://www.roblox.com/users/${userId}/profile">
      <meta name="twitter:card" content="summary">
      <meta name="twitter:title" content="${userData.displayName} (@${userData.name})">
      <meta name="twitter:description" content="${userData.description || 'No description available'}">
      <meta name="twitter:image" content="${avatarUrl}">
      <meta name="roblox:friends" content="${friendsData.count}">
      <meta name="roblox:followers" content="${followersData.count}">
    `;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${userData.displayName} (@${userData.name}) - Roblox</title>
        ${metaTags}
      </head>
      <body>
        <script>
          window.location.href = "https://www.roblox.com/users/${userId}/profile";
        </script>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error('Error fetching Roblox data:', error);
    res.status(500).send('Error fetching Roblox data');
  }
});

export default router;

