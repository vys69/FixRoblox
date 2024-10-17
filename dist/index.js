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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const port = process.env.PORT || 6969;
function fetchRobloxUserData(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://users.roblox.com/v1/users/${userId}`, { timeout: 5000 });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching user data:', error);
            throw new Error('Failed to fetch user data');
        }
    });
}
function fetchRobloxFriends(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://friends.roblox.com/v1/users/${userId}/friends/count`, { timeout: 5000 });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching friends count:', error);
            throw new Error('Failed to fetch friends count');
        }
    });
}
function fetchRobloxFollowers(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://friends.roblox.com/v1/users/${userId}/followers/count`, { timeout: 5000 });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching followers count:', error);
            throw new Error('Failed to fetch followers count');
        }
    });
}
function fetchRobloxAvatar(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=png`, { timeout: 5000 });
            return response.data.data[0].imageUrl;
        }
        catch (error) {
            console.error('Error fetching avatar:', error);
            return `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`;
        }
    });
}
app.get('/', (req, res) => {
    //   res.redirect('https://github.com');
    return res.send('Express Typescript on Vercel');
});
app.get('/users/:userId/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const [userData, friendsData, followersData, avatarUrl] = yield Promise.all([
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
    }
    catch (error) {
        console.error('Error fetching Roblox data:', error);
        res.status(500).send('Error fetching Roblox data');
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map