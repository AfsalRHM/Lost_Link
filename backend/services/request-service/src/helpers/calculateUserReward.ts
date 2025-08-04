const calculateUserReward = ({ rewardAmount }: { rewardAmount: number }) => {
  const calulateCommission = Math.floor((rewardAmount / 100) * 5);

  const calculatedUserReward = rewardAmount - calulateCommission;

  return calculatedUserReward;
};

export default calculateUserReward;
