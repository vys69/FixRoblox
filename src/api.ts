import axios from 'axios';
import { RobloxUser, RobloxFriends, RobloxFollowers } from './types';

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

