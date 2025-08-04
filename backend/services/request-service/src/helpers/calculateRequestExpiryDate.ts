const calculateRequestExpiryDate = ({
  expirationLimit,
}: {
  expirationLimit: string;
}) => {
  const expirationMonths = parseInt(expirationLimit.split(" ")[0], 10);

  const currentDate = new Date();
  const expiryDate = new Date(
    currentDate.setMonth(currentDate.getMonth() + expirationMonths)
  );

  return expiryDate;
};

export default calculateRequestExpiryDate;
