export interface RobloxUser {
  name: string;
  displayName: string;
  description: string;
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

export interface CatalogItem {
  id: number;
  itemType: 'Asset' | 'Bundle';
  assetType?: number;
  bundleType?: string;
  name: string;
  description: string;
  productId: number;
  genres: string[];
  itemStatus: string[];
  itemRestrictions: string[];
  creatorType: string;
  creatorTargetId: number;
  creatorName: string;
  price: number | null;
  priceStatus?: 'Free' | 'OffSale' | 'NoResellers';
  favoriteCount: number;
  purchaseCount?: number;
  offSaleDeadline: string | null;
  lowestPrice?: number;
  unitsAvailableForConsumption?: number;
}

export interface CatalogItemResponse {
  keyword: string | null;
  previousPageCursor: string | null;
  nextPageCursor: string | null;
  data: CatalogItem[];
}
