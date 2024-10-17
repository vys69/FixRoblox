import { Router } from 'express';
import { 
  fetchRobloxUserData, 
  fetchRobloxFriends, 
  fetchRobloxFollowers, 
  fetchRobloxAvatar,
  fetchRobloxGroupData,
  fetchRobloxGroupMemberCount,
  fetchCatalogItemData,
  fetchBundleData,
  createErrorMetaTags
} from './api';

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

router.get('/test', (req, res) => {
    res.send('Test route working');
  });

router.get('/ping', (req, res) => {
    res.send('pong');
  });

router.get('/groups/:groupId/:groupName?', async (req, res) => {
  console.log('Group route hit:', req.params);
  const groupId = req.params.groupId;
  let groupName = req.params.groupName || '';

  try {
    const groupData = await fetchRobloxGroupData(groupId);

    // If groupName wasn't provided in the URL or doesn't match, use the fetched name
    if (!groupName || groupName !== encodeURIComponent(groupData.name.replace(/\s+/g, '-'))) {
      groupName = encodeURIComponent(groupData.name.replace(/\s+/g, '-'));
    }

    const groupIconUrl = `https://i.pinimg.com/736x/7e/a1/65/7ea165670bc9c0844337266b454e6a02.jpg`;  // Replace with actual group icon URL if available

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
  } catch (error) {
    console.error('Error fetching Roblox group data:', error);
    res.status(500).send('Error fetching Roblox group data');
  }
});

router.get('/catalog/:itemId/:itemType?/:itemName?', async (req, res) => {
  const { itemId, itemType, itemName } = req.params;

  if (!itemType) {
    const errorHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - Invalid URL</title>
        ${createErrorMetaTags('Invalid URL. Please specify /item or /bundle after the item ID.')}
      </head>
      <body>
        <h1>Error: Invalid URL</h1>
        <p>Please specify /item or /bundle after the item ID.</p>
      </body>
      </html>
    `;
    return res.status(400).send(errorHtml);
  }

  try {
    let itemData;
    if (itemType === 'item') {
      itemData = await fetchCatalogItemData(itemId);
    } else if (itemType === 'bundle') {
      itemData = await fetchBundleData(itemId);
    } else {
      throw new Error('Invalid item type. Use /item or /bundle.');
    }

    // If itemName wasn't provided in the URL or doesn't match, use the fetched name
    const encodedItemName = encodeURIComponent(itemData.name.replace(/\s+/g, '-'));
    if (!itemName || itemName !== encodedItemName) {
      return res.redirect(`/catalog/${itemId}/${itemType}/${encodedItemName}`);
    }

    const itemIconUrl = `https://www.roblox.com/asset-thumbnail/image?assetId=${itemId}&width=420&height=420&format=png`;

    let description = `Type: ${itemData.itemType}\n`;
    description += `Creator: ${itemData.creatorName} (${itemData.creatorType})\n`;
    description += `Price: ${itemData.price !== undefined ? `R$${itemData.price}` : 'N/A'}\n`;
    description += `Lowest Price: ${itemData.lowestPrice !== undefined ? `R$${itemData.lowestPrice}` : 'N/A'}\n`;
    description += `Sale Status: ${itemData.priceStatus}\n`;
    description += `Limited: ${itemData.isLimited ? 'Yes' : 'No'}\n`;
    description += `Collectible Type: ${itemData.collectibleItemType || 'N/A'}\n`;

    description += `\n${itemData.description || 'No description available'}`;

    const metaTags = `
      <meta property="og:site_name" content="Roblox Catalog Item">
      <meta property="og:title" content="${itemData.name}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${itemIconUrl}">
      <meta property="og:image:width" content="420">
      <meta property="og:image:height" content="420">
      <meta property="og:url" content="https://www.roblox.com/catalog/${itemId}/${itemName}">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${itemData.name}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${itemIconUrl}">
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
          window.location.href = "https://www.roblox.com/catalog/${itemId}/${itemName}";
        </script>
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error('Error fetching Roblox catalog item data:', error);
    res.status(500).send('Error fetching Roblox catalog item data');
  }
});

export default router;
