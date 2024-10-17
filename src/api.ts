import axios from 'axios';
import { RobloxUser, RobloxFriends, RobloxFollowers, RobloxGroup, RobloxGroupOwner, CatalogItemResponse, CatalogItem, BundleItem } from './types';

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

// Note: The API doesn't provide creation date, followers count, or other details not present in the response.
// If these are needed, you may need to look for alternative API endpoints or methods to retrieve this information.

export async function fetchCatalogItemData(itemId: string): Promise<CatalogItem> {
  try {
    const assetResponse = await axios.get(`https://economy.roblox.com/v2/assets/${itemId}/details`, { timeout: API_TIMEOUT });
    const assetData = assetResponse.data;
    
    return {
      id: assetData.AssetId,
      itemType: 'Asset',
      name: assetData.Name,
      description: assetData.Description,
      price: assetData.PriceInRobux,
      creatorName: assetData.Creator.Name,
      creatorType: assetData.Creator.CreatorType,
      creatorTargetId: assetData.Creator.CreatorTargetId,
      productId: assetData.ProductId,
      assetType: assetData.AssetTypeId,
      isLimited: assetData.IsLimited || assetData.IsLimitedUnique,
      isLimitedUnique: assetData.IsLimitedUnique,
      collectibleItemType: assetData.ProductType,
      lowestPrice: assetData.CollectiblesItemDetails?.CollectibleLowestResalePrice,
      priceStatus: assetData.IsForSale ? 'For Sale' : 'Off Sale',
    };
  } catch (error) {
    console.error('Error fetching catalog item data:', error);
    throw new Error('Failed to fetch catalog item data');
  }
}

async function fetchBundleItems(bundleId: string): Promise<BundleItem[]> {
  try {
    const response = await axios.get(`https://catalog.roblox.com/v1/bundles/${bundleId}/details`, { timeout: API_TIMEOUT });
    return response.data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      type: item.type
    }));
  } catch (error) {
    console.error('Error fetching bundle items:', error);
    return [];
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

export async function fetchBundleData(bundleId: string): Promise<CatalogItem> {
  try {
    const bundleResponse = await axios.get(`https://catalog.roblox.com/v1/bundles/${bundleId}/details`, { timeout: API_TIMEOUT });
    const bundleData = bundleResponse.data;
    const bundleItems = await fetchBundleItems(bundleId);
    
    return {
      id: bundleData.id,
      itemType: 'Bundle',
      name: bundleData.name,
      description: bundleData.description,
      price: bundleData.price,
      creatorName: bundleData.creator.name,
      creatorType: bundleData.creator.type,
      creatorTargetId: bundleData.creator.id,
      bundleType: bundleData.bundleType,
      isLimited: false, // Bundles are typically not limited, but you may need to adjust this if that's not always the case
      isLimitedUnique: false, // Same as above
      collectibleItemType: 'Bundle', // You might want to adjust this based on the actual data
      priceStatus: bundleData.price !== null ? 'For Sale' : 'Off Sale',
      bundleItems: bundleItems,
      // Add these properties to match CatalogItem interface
      productId: bundleData.product?.id || null,
      assetType: null, // Bundles don't have an assetType
      lowestPrice: null // Bundles typically don't have a resale market, but you can adjust if needed
    };
  } catch (error) {
    console.error('Error fetching bundle data:', error);
    throw new Error('Failed to fetch bundle data');
  }
}
