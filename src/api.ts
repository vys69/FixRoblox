import axios from 'axios';
import { RobloxUser, RobloxFriends, RobloxFollowers, RobloxGroup, RobloxGroupOwner, CatalogItemResponse, CatalogItem, BundleItem, RolimonData, RobloxGame } from './types';

const API_TIMEOUT = 5000;

export async function fetchRobloxUserData(userId: string): Promise<RobloxUser> {
  try {
    const response = await axios.get(`https://users.roblox.com/v1/users/${userId}`, { timeout: API_TIMEOUT });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user data');
  }
}

export async function fetchRobloxFriends(userId: string): Promise<RobloxFriends> {
  try {
    const response = await axios.get(`https://friends.roblox.com/v1/users/${userId}/friends/count`, { timeout: API_TIMEOUT });
    return response.data;
  } catch (error) {
    console.error('Error fetching friends count:', error);
    throw new Error('Failed to fetch friends count');
  }
}

export async function fetchRobloxFollowers(userId: string): Promise<RobloxFollowers> {
  try {
    const response = await axios.get(`https://friends.roblox.com/v1/users/${userId}/followers/count`, { timeout: API_TIMEOUT });
    return response.data;
  } catch (error) {
    console.error('Error fetching followers count:', error);
    throw new Error('Failed to fetch followers count');
  }
}

export async function fetchRobloxAvatar(userId: string): Promise<string> {
  try {
    const response = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=png`, { timeout: API_TIMEOUT });
    return response.data.data[0].imageUrl;
  } catch (error) {
    console.error('Error fetching avatar:', error);
    return `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`;
  }
}

// Group APIs

export async function fetchRobloxGroupData(groupId: string): Promise<RobloxGroup> {
  try {
    const response = await axios.get(`https://groups.roblox.com/v1/groups/${groupId}`, { timeout: API_TIMEOUT });
    return response.data;
  } catch (error) {
    console.error('Error fetching group data:', error);
    throw new Error('Failed to fetch group data');
  }
}

export async function fetchRobloxGroupName(groupId: string): Promise<string> {
  try {
    const groupData = await fetchRobloxGroupData(groupId);
    return groupData.name;
  } catch (error) {
    console.error('Error fetching group name:', error);
    throw new Error('Failed to fetch group name');
  }
}

export async function fetchRobloxGroupDescription(groupId: string): Promise<string> {
  try {
    const groupData = await fetchRobloxGroupData(groupId);
    return groupData.description;
  } catch (error) {
    console.error('Error fetching group description:', error);
    throw new Error('Failed to fetch group description');
  }
}

export async function fetchRobloxGroupMemberCount(groupId: string): Promise<number> {
  try {
    const groupData = await fetchRobloxGroupData(groupId);
    return groupData.memberCount;
  } catch (error) {
    console.error('Error fetching group member count:', error);
    throw new Error('Failed to fetch group member count');
  }
}

export async function fetchRobloxGroupOwner(groupId: string): Promise<RobloxGroupOwner> {
  try {
    const groupData = await fetchRobloxGroupData(groupId);
    return groupData.owner;
  } catch (error) {
    console.error('Error fetching group owner:', error);
    throw new Error('Failed to fetch group owner');
  }
}

export async function fetchRobloxGroupId(groupId: string): Promise<number> {
  try {
    const groupData = await fetchRobloxGroupData(groupId);
    return groupData.id;
  } catch (error) {
    console.error('Error fetching group ID:', error);
    throw new Error('Failed to fetch group ID');
  }
}

export async function fetchRobloxGroupIcon(groupId: string): Promise<string> {
  try {
    const response = await axios.get(`https://thumbnails.roblox.com/v1/groups/icons?groupIds=${groupId}&size=420x420&format=Png&isCircular=false`, { timeout: API_TIMEOUT });
    return response.data.data[0].imageUrl;
  } catch (error) {
    console.error('Error fetching group icon:', error);
    // Return a fallback image URL if the request fails
    return `https://www.roblox.com/group-thumbnails/image?groupId=${groupId}&width=420&height=420`;
  }
}

export async function fetchRolimonData(userId: string): Promise<RolimonData> {
  try {
    const response = await axios.get(`https://api.rolimons.com/players/v1/playerinfo/${userId}`, { timeout: 5000 });
    return {
      rap: response.data.rap || 0,
      value: response.data.value || 0
    };
  } catch (error) {
    console.error('Error fetching Rolimon data:', error);
    return { rap: 0, value: 0 }; // Return default values on error
  }
}

export async function fetchCatalogItemData(itemId: string): Promise<CatalogItem> {
  try {
    const response = await axios.get(`https://economy.roblox.com/v2/assets/${itemId}/details`, { timeout: API_TIMEOUT });
    const data = response.data;
    return {
      id: data.AssetId,
      itemType: 'Asset',
      name: data.Name,
      description: data.Description,
      price: data.PriceInRobux,
      creatorName: data.Creator.Name,
      creatorType: data.Creator.CreatorType,
      creatorTargetId: data.Creator.CreatorTargetId,
      productId: data.ProductId,
      assetType: data.AssetTypeId,
      isLimited: data.IsLimited || data.IsLimitedUnique,
      isLimitedUnique: data.IsLimitedUnique,
      collectibleItemType: data.CollectibleItemType,
      lowestPrice: data.LowestPrice,
      priceStatus: data.PriceStatus
    };
  } catch (error) {
    console.error('Error fetching catalog item data:', error);
    throw new Error('Failed to fetch catalog item data');
  }
}

export async function fetchBundleData(bundleId: string): Promise<CatalogItem> {
  try {
    const response = await axios.get(`https://catalog.roblox.com/v1/bundles/${bundleId}/details`, { timeout: API_TIMEOUT });
    const data = response.data;
    return {
      id: data.id,
      itemType: 'Bundle',
      name: data.name,
      description: data.description,
      price: data.price,
      creatorName: data.creator.name,
      creatorType: data.creator.type,
      creatorTargetId: data.creator.id,
      bundleType: data.bundleType,
      isLimited: false, // Bundles are typically not limited
      isLimitedUnique: false,
      collectibleItemType: null,
      lowestPrice: null,
      priceStatus: data.price !== null ? 'For Sale' : 'Off Sale',
      bundleItems: data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        type: item.type
      })),
      productId: null, // Bundles don't have a productId
      assetType: null  // Bundles don't have an assetType
    };
  } catch (error) {
    console.error('Error fetching bundle data:', error);
    throw new Error('Failed to fetch bundle data');
  }
}

export function createErrorMetaTags(errorMessage: string): string {
  return `
    <meta property="og:title" content="Error - Roblox Item Not Found">
    <meta property="og:description" content="${errorMessage}">
    <meta property="og:image" content="https://rxblox.com/error-image.png">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Error - Roblox Item Not Found">
    <meta name="twitter:description" content="${errorMessage}">
    <meta name="twitter:image" content="https://rxblox.com/error-image.png">
  `;
}

export async function fetchRobloxGameData(gameId: string): Promise<RobloxGame> {
  try {
    console.log(`Fetching game data for ID: ${gameId}`);
    const response = await axios.get(`https://games.roblox.com/v1/games/multiget-place-details?placeIds=${gameId}`, {
      timeout: API_TIMEOUT,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://www.roblox.com/',
        'Origin': 'https://www.roblox.com',
        'Cookie': `.ROBLOSECURITY=${process.env.roblosecurity}`
      }
    });
    
    if (!response.data[0]) {
      console.log('No game data found in response');
      throw new Error('Game not found');
    }
    
    return response.data[0];
  } catch (error) {
    console.error('Detailed error:', error);
    throw new Error('Failed to fetch game data');
  }
}
