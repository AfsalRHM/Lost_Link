export const tiers = [
  { name: "Bronze Scout", minPoints: 1 },
  { name: "Silver Scout", minPoints: 2001 },
  { name: "Gold Scout", minPoints: 5001 },
  { name: "Platinum Scout", minPoints: 10001 },
  { name: "Diamond Scout", minPoints: 25001 },
  { name: "Mythic Scout", minPoints: 50001 },
  { name: "Legendary Scout", minPoints: 100000 },
];

export const getTierByPoints = (points: number): string => {
  if (points === 0) return "Rookie Scout";

  for (let i = tiers.length - 1; i >= 0; i--) {
    if (points >= tiers[i].minPoints) {
      return tiers[i].name;
    }
  }
  return "Rookie Scout";
};

export const getNextTier = (points: number): string => {
  if (points > 100000) return "No Tier Available";

  for (let i = 0; i < tiers.length; i++) {
    if (points < tiers[i].minPoints) {
      return tiers[i].name;
    }
  }
  return "Legendary Scout";
};

export const getPreviousTier = (points: number): string => {
  if (points === 0) return "No Tier Available";

  for (let i = tiers.length - 1; i > 0; i--) {
    if (points >= tiers[i].minPoints) {
      return tiers[i - 1].name;
    }
  }
  return "Rookie Scout";
};
