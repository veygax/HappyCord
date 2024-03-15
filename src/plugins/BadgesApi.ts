import { HappyCord, Plugin } from "../../@types/HappyCord.js";

let HappyCord: HappyCord = window["HappyCord"];

const HAPPYCORD_CONTRIBUTOR_ICON =
  "https://cdn.discordapp.com/emojis/1217931617167999059.webp?size=128&quality=lossless";

interface Badge {
  id: string;
  description: string;
  icon: string;
  link: string;
}

let BadgesApi: Plugin = {
  name: "BadgesApi",
  description: "An api that allows to patche user data (user profiles, etc...)",
  authors: [HappyCord.Devs.HappyEnderman],
  patches: [
    {
      /** modify the badge icon image src getter */
      find: "getBadgeAsset:function(){",
      replacements: [
        {
          match: /getBadgeAsset:function\(\){return \w+}/,
          replace:
            "getBadgeAsset:function(){return HappyCord.plugins.BadgesApi.getBadgeAsset}",
        },
      ],
    }
  ],
  getBadgeAsset(icon) {
    return icon.startsWith("https://")
      ? icon
      : "".concat("https://cdn.discordapp.com", "/badge-icons/", icon, ".png");
  },
  start() {
    if (!HappyCord.settings.BadgesApi.badges) {
      HappyCord.settings.BadgesApi.badges = {};
      HappyCord.SettigsStorage.saveChanges();
    }

    if (!HappyCord.settings.BadgesApi.userProfilePatches) {
      HappyCord.settings.BadgesApi.userProfilePatches = {};
      HappyCord.SettigsStorage.saveChanges();
    }

    if (!HappyCord.settings.BadgesApi.UserPatches) {
      HappyCord.settings.BadgesApi.UserPatches = {};
      HappyCord.SettigsStorage.saveChanges();
    }

    /** user profile patcher */

    if (!HappyCord.plugins.BadgesApi.getUserProfile_) {
      HappyCord.plugins.BadgesApi.getUserProfile_ =
        HappyCord.findByProps("getUserProfile").getUserProfile;
    }

    HappyCord.findByProps("getUserProfile").getUserProfile = (userId) => {
      let user = HappyCord.plugins.BadgesApi.getUserProfile_(userId);

      if (!user) {
        return undefined;
      }
      /** User is contributor */
      if (Object.values(HappyCord.Devs).includes(userId)) {
        if (!user.badges) {
          user.badges = [];
        }
        if (
          !user.badges
            .map((badge) => badge.id)
            .includes("happycord_contributor")
        ) {
          user.badges.push({
            id: "happycord_contributor",
            description: "Contributor",
            icon: HAPPYCORD_CONTRIBUTOR_ICON,
            link: "https://github.com/Wumpus-University/HappyCord/commits",
          });
        }
      }

      const badges = HappyCord.settings.BadgesApi.badges[userId] ?? [];
      for (let badge of badges) {
        if (!user.badges.map((badge) => badge.id).includes(badge.id)) {
          user.badges.push(badge);
        }
      }

      if (HappyCord.settings.BadgesApi.userProfilePatches[userId]) {
        user = Object.assign(
          user,
          HappyCord.settings.BadgesApi.userProfilePatches[userId]
        );
      }

      return user;
    };
  },
  addBadge(userId: string, badge: Badge) {
    if (!HappyCord.settings.BadgesApi.badges) {
      HappyCord.settings.BadgesApi.badges = {};
      HappyCord.SettigsStorage.saveChanges();
    }
    const badges = HappyCord.settings.BadgesApi.badges[userId] ?? [];
    badges.push(badge);
    HappyCord.settings.BadgesApi.badges[userId] = badges;

    HappyCord.SettigsStorage.saveChanges();
    return true;
  },
  addUserProfilePatch(userId: string, data: any) {
    if (!HappyCord.settings.BadgesApi.userProfilePatches) {
      HappyCord.settings.BadgesApi.userProfilePatches = {};
      HappyCord.SettigsStorage.saveChanges();
    }

    HappyCord.settings.BadgesApi.userProfilePatches[userId] = data;

    HappyCord.SettigsStorage.saveChanges();
    return true;
  },

  stop() {
    HappyCord.findByProps("getUserProfile").getUserProfile =
      HappyCord.plugins.BadgesApi.getUserProfile;
  },
};
HappyCord.definePlugin(BadgesApi);
