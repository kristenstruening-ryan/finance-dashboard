import { match } from "assert";
import axios from "axios";

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY;

export const getStockData = async (symbol: string) => {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`;
    const response = await axios.get(url);
    const quote = response.data["Global Quote"];
    if (!quote) return null;
    return {
      price: parseFloat(quote["05. price"]),
      change: quote["09. change"],
      changePercent: quote["10. change percent"],
    };
  } catch (error) {
    console.error("Stock fetch error:", error);
    return null;
  }
};

export const searchStockSymbols = async (keywords: string) => {
  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${ALPHA_VANTAGE_KEY}`;
  const response = await axios.get(url);
  return response.data.bestMatches.map((match: any) => ({
    symbol: match["1. symbol"],
    name: match["2. name"],
    type: match["3. type"],
    region: match["4. region"],
  }));
};

const SYMBOL_MAP: Record<string, string> = {
  btc: "bitcoin",
  eth: "ethereum",
  sol: "solana",
  ada: "cardano",
  dot: "polkadot",
};

export const getCryptoPrice = async (
  symbol: string,
): Promise<number | null> => {
  try {
    const coinId = SYMBOL_MAP[symbol.toLowerCase()];
    if (!coinId) return null;

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`;
    const response = await axios.get(url);

    return response.data[coinId]?.usd || null;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
};

export const searchSymbols = async (keywords: string) => {
  try {
    const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${process.env.ALPHA_VANTAGE_KEY}`;
    const response = await axios.get(url);
    const matches = response.data.bestMatches || [];

    return matches.map((item: any) => ({
      symbol: item["1. symbol"],
      name: item["2. name"],
      type: item["3. type"],
      region: item["4. region"],
      currency: item["8. currency"],
    }));
  } catch (error) {
    console.error("Symbol search error:", error);
    return [];
  }
};
