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
        const [userData, friendsData, followersData, avatarUrl, rolimonData] = yield Promise.all([
            (0, api_1.fetchRobloxUserData)(userId),
            (0, api_1.fetchRobloxFriends)(userId),
            (0, api_1.fetchRobloxFollowers)(userId),
            (0, api_1.fetchRobloxAvatar)(userId),
            (0, api_1.fetchRolimonData)(userId)
        ]);
        // Create stats text with emojis
        const statsText = encodeURIComponent(`👥 ${friendsData.count}   👀 ${followersData.count}`);
        const metaTags = `
      <meta property="og:site_name" content="FixRoblox / Rxblox">
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
      <link rel="alternate" href="https://rxblox.vercel.app/owoembed?text=${statsText}&status=${userId}&author=${userData.name}" type="application/json+oembed" title="${userData.displayName}">
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
router.get('/catalog/:itemId/:itemName', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemId, itemName } = req.params;
    try {
        const itemData = yield (0, api_1.fetchCatalogItemData)(itemId);
        // Check if the provided itemName matches the fetched data
        const encodedItemName = encodeURIComponent(itemData.name.replace(/\s+/g, '-'));
        if (itemName !== encodedItemName) {
            return res.redirect(`/catalog/${itemId}/${encodedItemName}`);
        }
        const itemIconUrl = `https://www.roblox.com/asset-thumbnail/image?assetId=${itemId}&width=420&height=420&format=png`;
        const metaTags = `
      <meta property="og:title" content="${itemData.name}">
      <meta property="og:description" content="${itemData.description || 'No description available'}">
      <meta property="og:image" content="${itemIconUrl}">
      <meta property="og:url" content="https://www.roblox.com/catalog/${itemId}/${encodedItemName}">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${itemData.name}">
      <meta name="twitter:description" content="${itemData.description || 'No description available'}">
      <meta name="twitter:image" content="${itemIconUrl}">
      <meta name="roblox:item:price" content="${itemData.price !== null ? `R$${itemData.price}` : 'Off Sale'}">
      <meta name="roblox:item:type" content="${itemData.assetType}">
      <meta name="roblox:item:limited" content="${itemData.isLimited ? 'Yes' : 'No'}">
    `;
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${itemData.name} - Roblox Catalog Item</title>
        ${metaTags}
      </head>
      <body>
        <script>
          window.location.href = "https://www.roblox.com/catalog/${itemId}/${encodedItemName}";
        </script>
      </body>
      </html>
    `;
        res.send(html);
    }
    catch (error) {
        console.error('Error fetching Roblox catalog item data:', error);
        const errorHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - Item Not Found</title>
        ${(0, api_1.createErrorMetaTags)('The requested Roblox item could not be found.')}
      </head>
      <body>
        <h1>Error: Item Not Found</h1>
        <p>The requested Roblox item could not be found.</p>
      </body>
      </html>
    `;
        res.status(404).send(errorHtml);
    }
}));
router.get('/bundles/:bundleId/:bundleName', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bundleId, bundleName } = req.params;
    try {
        const bundleData = yield (0, api_1.fetchBundleData)(bundleId);
        // Check if the provided bundleName matches the fetched data
        const encodedBundleName = encodeURIComponent(bundleData.name.replace(/\s+/g, '-'));
        if (bundleName !== encodedBundleName) {
            return res.redirect(`/bundles/${bundleId}/${encodedBundleName}`);
        }
        const bundleIconUrl = `https://www.roblox.com/asset-thumbnail/image?assetId=${bundleId}&width=420&height=420&format=png`;
        const metaTags = `
      <meta property="og:title" content="${bundleData.name}">
      <meta property="og:description" content="${bundleData.description || 'No description available'}">
      <meta property="og:image" content="${bundleIconUrl}">
      <meta property="og:url" content="https://www.roblox.com/bundles/${bundleId}/${encodedBundleName}">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${bundleData.name}">
      <meta name="twitter:description" content="${bundleData.description || 'No description available'}">
      <meta name="twitter:image" content="${bundleIconUrl}">
      <meta name="roblox:bundle:price" content="${bundleData.price !== null ? `R$${bundleData.price}` : 'Off Sale'}">
      <meta name="roblox:bundle:type" content="${bundleData.bundleType}">
    `;
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${bundleData.name} - Roblox Bundle</title>
        ${metaTags}
      </head>
      <body>
        <script>
          window.location.href = "https://www.roblox.com/bundles/${bundleId}/${encodedBundleName}";
        </script>
      </body>
      </html>
    `;
        res.send(html);
    }
    catch (error) {
        console.error('Error fetching Roblox bundle data:', error);
        const errorHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - Bundle Not Found</title>
        ${(0, api_1.createErrorMetaTags)('The requested Roblox bundle could not be found.')}
      </head>
      <body>
        <h1>Error: Bundle Not Found</h1>
        <p>The requested Roblox bundle could not be found.</p>
      </body>
      </html>
    `;
        res.status(404).send(errorHtml);
    }
}));
router.get('/owoembed', (req, res) => {
    const { text, status, author, followers, friends } = req.query;
    const oembedResponse = {
        type: "rich",
        version: "1.0",
        title: `${author}'s Roblox Profile`,
        author_name: `👥 ${friends} 👀 ${followers}`,
        author_url: `https://www.roblox.com/users/${status}/profile`,
        provider_name: "FixRoblox",
        provider_url: "https://fixroblox.com",
        stats: decodeURIComponent(text)
    };
    res.json(oembedResponse);
});
exports.default = router;
//# sourceMappingURL=routes.js.map