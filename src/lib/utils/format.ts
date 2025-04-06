export const formatCurrencyUSD = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a number as Vietnamese currency
 * @param amount - The amount to format
 * @returns Formatted currency string in VND
 */
export const formatCurrency = (amount: number): string => {
  const numericAmount = Number(amount) * 1000;
  if (isNaN(numericAmount) || amount === null || amount === undefined) {
    return "0 ₫";
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};
