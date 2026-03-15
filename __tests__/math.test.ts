const calculateWeightedAverage = (
  currentShares: number,
  currentPrice: number,
  newShares: number,
  newPrice: number,
): number => {
  const totalShares = currentShares + newShares;
  const newValue = currentShares * currentPrice + newShares * newPrice;
  return Number((newValue / totalShares).toFixed(2));
};

describe("Portfolio Math Utilities", () => {
  test("calculates correct weighted average when adding new shares", () => {
    const result = calculateWeightedAverage(10, 100, 10, 200);
    expect(result).toBe(150.0);
  });
  test("handles uneven share amounts correctly", () => {
    const result = calculateWeightedAverage(5, 50, 2, 120);
    expect(result).toBe(70.0);
  });
  test("maintains price if buying at the same cost basis", () => {
    const result = calculateWeightedAverage(10, 100, 5, 100);
    expect(result).toBe(100.0);
  });
});
