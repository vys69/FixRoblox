export interface RobloxUser {
  name: string;
  displayName: string;
  description: string;
  created: string;
}

export interface RobloxFriends {
  count: number;
}

export interface RobloxFollowers {
  count: number;
}

export interface RobloxGroupOwner {
  hasVerifiedBadge: boolean;
  userId: number;
  username: string;
  displayName: string;
}

export interface RobloxGroup {
  id: number;
  name: string;
  description: string;
  owner: RobloxGroupOwner;
  shout: null | any; // You can create a more specific type if needed
  memberCount: number;
  isBuildersClubOnly: boolean;
  publicEntryAllowed: boolean;
  hasVerifiedBadge: boolean;
}

export interface BundleItem {
  id: number;
  name: string;
  type: string;
}

export interface CatalogItem {
  id: number;
  itemType: 'Asset' | 'Bundle';
  name: string;
  description: string;
  price: number | null;
  creatorName: string;
  creatorType: string;
  creatorTargetId: number;
  productId?: number | null;  // Make this optional
  assetType?: number | null;  // Make this optional
  bundleType?: string;
  isLimited: boolean;
  isLimitedUnique: boolean;
  collectibleItemType: string | null;
  lowestPrice: number | null;
  priceStatus: string;
  bundleItems?: BundleItem[];
}

export interface CatalogItemResponse {
  keyword: string | null;
  previousPageCursor: string | null;
  nextPageCursor: string | null;
  data: CatalogItem[];
}

export interface RolimonData {
  rap: number;
  value: number;
}

export interface RobloxUserData {
  description: string;
  created: string;
  isBanned: boolean;
  externalAppDisplayName: string | null;
  hasVerifiedBadge: boolean;
  id: number;
  name: string;
  displayName: string;
}

export interface RobloxGame {
  placeId: number;
  name: string;
  description: string;
  sourceName: string;
  sourceDescription: string;
  url: string;
  builder: string;
  builderId: number;
  hasVerifiedBadge: boolean;
  isPlayable: boolean;
  reasonProhibited: string;
  universeId: number;
  universeRootPlaceId: number;
  price: number;
  imageToken: string;
}