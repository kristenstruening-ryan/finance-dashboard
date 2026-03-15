import axios from "axios";

const FINNHUB_KEY = process.env.FINNHUB_KEY;
const BASE_URL = "https://finnhub.io/api/v1";

export interface FinnhubQuote {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
}

export const getLivePrice = async (
  symbol: string,
): Promise<FinnhubQuote | null> => {
  const data = await getStockData(symbol);
  return data
    ? ({ c: data.price, d: data.change, dp: data.changePercent } as any)
    : null;
};

export const getStockData = async (symbol: string) => {
  try {
    const url = `${BASE_URL}/quote?symbol=${symbol.toUpperCase()}&token=${FINNHUB_KEY}`;
    const response = await axios.get(url);

    const data = response.data;

    if (!data.c || data.c === 0) {
      console.warn(`No price data found for symbol: ${symbol}`);
      return null;
    }

    return {
      price: data.c,
      change: data.d,
      changePercent: data.dp,
    };
  } catch (error) {
    console.error(`Finnhub fetch error for ${symbol}:`, error);
    return null;
  }
};

export const getCryptoPrice = async (
  symbol: string,
): Promise<number | null> => {
  try {
    const data = await getStockData(symbol);
    return data ? data.price : null;
  } catch (error) {
    console.error(`Error fetching crypto price for ${symbol}:`, error);
    return null;
  }
};

export const searchSymbols = async (keywords: string) => {
  try {
    const url = `${BASE_URL}/search?q=${keywords}&token=${FINNHUB_KEY}`;
    const response = await axios.get(url);

    const results = response.data.result;

    if (!results || !Array.isArray(results)) {
      return [];
    }

    return results
      .filter((item: any) => {
        const type = item.type?.toLowerCase();
        const isValidType = ["common stock", "etc", "etf", "crypto"].includes(
          type,
        );
        const isNotIndex =
          !item.symbol.includes(".") && !item.symbol.includes(":");
        return isValidType || isNotIndex;
      })
      .slice(0, 10)
      .map((item: any) => ({
        symbol: item.symbol,
        name: item.description,
        type: item.type || "Asset",
        region: "",
        currency: item.currency || "USD",
      }));
  } catch (error) {
    console.error("Finnhub symbol search error:", error);
    return [];
  }
};
