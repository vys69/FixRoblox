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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorMetaTags = exports.fetchBundleData = exports.fetchCatalogItemData = exports.fetchRobloxGroupId = exports.fetchRobloxGroupOwner = exports.fetchRobloxGroupMemberCount = exports.fetchRobloxGroupDescription = exports.fetchRobloxGroupName = exports.fetchRobloxGroupData = exports.fetchRobloxAvatar = exports.fetchRobloxFollowers = exports.fetchRobloxFriends = exports.fetchRobloxUserData = void 0;
const axios_1 = __importDefault(require("axios"));
const API_TIMEOUT = 5000;
function fetchRobloxUserData(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://users.roblox.com/v1/users/${userId}`, { timeout: API_TIMEOUT });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching user data:', error);
            throw new Error('Failed to fetch user data');
        }
    });
}
exports.fetchRobloxUserData = fetchRobloxUserData;
function fetchRobloxFriends(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://friends.roblox.com/v1/users/${userId}/friends/count`, { timeout: API_TIMEOUT });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching friends count:', error);
            throw new Error('Failed to fetch friends count');
        }
    });
}
exports.fetchRobloxFriends = fetchRobloxFriends;
function fetchRobloxFollowers(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://friends.roblox.com/v1/users/${userId}/followers/count`, { timeout: API_TIMEOUT });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching followers count:', error);
            throw new Error('Failed to fetch followers count');
        }
    });
}
exports.fetchRobloxFollowers = fetchRobloxFollowers;
function fetchRobloxAvatar(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=png`, { timeout: API_TIMEOUT });
            return response.data.data[0].imageUrl;
        }
        catch (error) {
            console.error('Error fetching avatar:', error);
            return `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`;
        }
    });
}
exports.fetchRobloxAvatar = fetchRobloxAvatar;
// Group APIs
function fetchRobloxGroupData(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://groups.roblox.com/v1/groups/${groupId}`, { timeout: API_TIMEOUT });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching group data:', error);
            throw new Error('Failed to fetch group data');
        }
    });
}
exports.fetchRobloxGroupData = fetchRobloxGroupData;
function fetchRobloxGroupName(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const groupData = yield fetchRobloxGroupData(groupId);
            return groupData.name;
        }
        catch (error) {
            console.error('Error fetching group name:', error);
            throw new Error('Failed to fetch group name');
        }
    });
}
exports.fetchRobloxGroupName = fetchRobloxGroupName;
function fetchRobloxGroupDescription(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const groupData = yield fetchRobloxGroupData(groupId);
            return groupData.description;
        }
        catch (error) {
            console.error('Error fetching group description:', error);
            throw new Error('Failed to fetch group description');
        }
    });
}
exports.fetchRobloxGroupDescription = fetchRobloxGroupDescription;
function fetchRobloxGroupMemberCount(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const groupData = yield fetchRobloxGroupData(groupId);
            return groupData.memberCount;
        }
        catch (error) {
            console.error('Error fetching group member count:', error);
            throw new Error('Failed to fetch group member count');
        }
    });
}
exports.fetchRobloxGroupMemberCount = fetchRobloxGroupMemberCount;
function fetchRobloxGroupOwner(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const groupData = yield fetchRobloxGroupData(groupId);
            return groupData.owner;
        }
        catch (error) {
            console.error('Error fetching group owner:', error);
            throw new Error('Failed to fetch group owner');
        }
    });
}
exports.fetchRobloxGroupOwner = fetchRobloxGroupOwner;
function fetchRobloxGroupId(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const groupData = yield fetchRobloxGroupData(groupId);
            return groupData.id;
        }
        catch (error) {
            console.error('Error fetching group ID:', error);
            throw new Error('Failed to fetch group ID');
        }
    });
}
exports.fetchRobloxGroupId = fetchRobloxGroupId;
function fetchCatalogItemData(itemId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://economy.roblox.com/v2/assets/${itemId}/details`, { timeout: API_TIMEOUT });
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
        }
        catch (error) {
            console.error('Error fetching catalog item data:', error);
            throw new Error('Failed to fetch catalog item data');
        }
    });
}
exports.fetchCatalogItemData = fetchCatalogItemData;
function fetchBundleData(bundleId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://catalog.roblox.com/v1/bundles/${bundleId}/details`, { timeout: API_TIMEOUT });
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
                isLimited: false,
                isLimitedUnique: false,
                collectibleItemType: null,
                lowestPrice: null,
                priceStatus: data.price !== null ? 'For Sale' : 'Off Sale',
                bundleItems: data.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    type: item.type
                })),
                productId: null,
                assetType: null // Bundles don't have an assetType
            };
        }
        catch (error) {
            console.error('Error fetching bundle data:', error);
            throw new Error('Failed to fetch bundle data');
        }
    });
}
exports.fetchBundleData = fetchBundleData;
function createErrorMetaTags(errorMessage) {
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
exports.createErrorMetaTags = createErrorMetaTags;
//# sourceMappingURL=api.js.map