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
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (points >= tiers[i].minPoints) {
      return tiers[i].name;
    }
  }
  return "Rookie Scout";
};
