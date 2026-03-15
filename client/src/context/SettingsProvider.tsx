import { useState, useEffect, type ReactNode } from "react";
import { SettingsContext } from "../hooks/useSettings"; // Point this to your Context definition
import type { Currency, Theme } from "../types";

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>(
    (localStorage.getItem("pref-currency") as Currency) || "USD",
  );
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("pref-theme") as Theme) || "light",
  );

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("pref-currency", currency);
    localStorage.setItem("pref-theme", theme);

    console.log("Theme switched to:", theme); // Check your console!
  }, [theme, currency]);

  const formatValue = (value: number) => {
    const rates = { USD: 1, EUR: 0.92, GBP: 0.78, BTC: 0.000015 };
    const convertedValue = value * (rates[currency] || 1);

    if (currency === "BTC") return `₿${convertedValue.toFixed(8)}`;

    const localeMap = {
      USD: "en-US",
      EUR: "de-DE",
      GBP: "en-GB", 
    };

    return new Intl.NumberFormat(
      localeMap[currency as keyof typeof localeMap],
      {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
      },
    ).format(value);
  };

  return (
    <SettingsContext.Provider
      value={{ currency, theme, setCurrency, setTheme, formatValue }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
