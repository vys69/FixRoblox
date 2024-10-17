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
