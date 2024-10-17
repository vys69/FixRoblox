"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = require("./api");
const router = (0, express_1.Router)();
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
router.get('/users/:userId/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const [userData, friendsData, followersData, avatarUrl] = yield Promise.all([
            (0, api_1.fetchRobloxUserData)(userId),
            (0, api_1.fetchRobloxFriends)(userId),
            (0, api_1.fetchRobloxFollowers)(userId),
            (0, api_1.fetchRobloxAvatar)(userId)
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
    }
    catch (error) {
        console.error('Error fetching Roblox data:', error);
        res.status(500).send('Error fetching Roblox data');
    }
}));
router.get('/test', (req, res) => {
    res.send('Test route working');
});
router.get('/ping', (req, res) => {
    res.send('pong');
});
router.get('/groups/:groupId/:groupName?', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Group route hit:', req.params);
    const groupId = req.params.groupId;
    let groupName = req.params.groupName || '';
    try {
        const groupData = yield (0, api_1.fetchRobloxGroupData)(groupId);
        // If groupName wasn't provided in the URL or doesn't match, use the fetched name
        if (!groupName || groupName !== encodeURIComponent(groupData.name.replace(/\s+/g, '-'))) {
            groupName = encodeURIComponent(groupData.name.replace(/\s+/g, '-'));
        }
        const groupIconUrl = `https://i.pinimg.com/736x/7e/a1/65/7ea165670bc9c0844337266b454e6a02.jpg`; // Replace with actual group icon URL if available
        const metaTags = `
      <meta property="og:title" content="${groupData.name}">
      <meta property="og:description" content="${groupData.description || 'No description available'}">
      <meta property="og:image" content="${groupIconUrl}">
      <meta property="og:url" content="https://www.roblox.com/groups/${groupId}/${groupName}">
      <meta name="twitter:card" content="summary">
      <meta name="twitter:title" content="${groupData.name}">
      <meta name="twitter:description" content="${groupData.description || 'No description available'}">
      <meta name="twitter:image" content="${groupIconUrl}">
      <meta name="roblox:group:members" content="${groupData.memberCount}">
      <meta name="roblox:group:owner" content="${groupData.owner.displayName} (@${groupData.owner.username})">
    `;
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${groupData.name} - Roblox Group</title>
        ${metaTags}
      </head>
      <body>
        <script>
          window.location.href = "https://www.roblox.com/groups/${groupId}/${groupName}";
        </script>
      </body>
      </html>
    `;
        res.send(html);
    }
    catch (error) {
        console.error('Error fetching Roblox group data:', error);
        res.status(500).send('Error fetching Roblox group data');
    }
}));
exports.default = router;
//# sourceMappingURL=routes.js.map