const calculatePoints = ({ rewardAmount }: { rewardAmount: number }) => {
  const calculatedPoints = Math.round(2.508 * Math.pow(rewardAmount, 1.0003));

  return calculatedPoints;
};

export default calculatePoints;
