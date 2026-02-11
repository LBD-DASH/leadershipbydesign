import { useState, useEffect } from "react";

interface GeoPricing {
  countryCode: string;
  currencySymbol: string;
  currencyCode: string;
  exchangeRate: number; // relative to ZAR
  isLoading: boolean;
}

// Approximate exchange rates from ZAR (updated periodically)
const CURRENCY_MAP: Record<string, { symbol: string; code: string; rate: number }> = {
  US: { symbol: "$", code: "USD", rate: 0.055 },
  GB: { symbol: "£", code: "GBP", rate: 0.043 },
  EU: { symbol: "€", code: "EUR", rate: 0.050 },
  DE: { symbol: "€", code: "EUR", rate: 0.050 },
  FR: { symbol: "€", code: "EUR", rate: 0.050 },
  IT: { symbol: "€", code: "EUR", rate: 0.050 },
  ES: { symbol: "€", code: "EUR", rate: 0.050 },
  NL: { symbol: "€", code: "EUR", rate: 0.050 },
  BE: { symbol: "€", code: "EUR", rate: 0.050 },
  AT: { symbol: "€", code: "EUR", rate: 0.050 },
  PT: { symbol: "€", code: "EUR", rate: 0.050 },
  IE: { symbol: "€", code: "EUR", rate: 0.050 },
  FI: { symbol: "€", code: "EUR", rate: 0.050 },
  CA: { symbol: "C$", code: "CAD", rate: 0.076 },
  AU: { symbol: "A$", code: "AUD", rate: 0.084 },
  NZ: { symbol: "NZ$", code: "NZD", rate: 0.092 },
  IN: { symbol: "₹", code: "INR", rate: 4.6 },
  NG: { symbol: "₦", code: "NGN", rate: 85 },
  KE: { symbol: "KSh", code: "KES", rate: 7.1 },
  GH: { symbol: "GH₵", code: "GHS", rate: 0.83 },
  AE: { symbol: "AED", code: "AED", rate: 0.20 },
  SG: { symbol: "S$", code: "SGD", rate: 0.073 },
  JP: { symbol: "¥", code: "JPY", rate: 8.2 },
  CN: { symbol: "¥", code: "CNY", rate: 0.40 },
  BR: { symbol: "R$", code: "BRL", rate: 0.31 },
  MX: { symbol: "MX$", code: "MXN", rate: 0.94 },
  ZA: { symbol: "R", code: "ZAR", rate: 1 },
  BW: { symbol: "P", code: "BWP", rate: 0.74 },
  NA: { symbol: "N$", code: "NAD", rate: 1 },
  MZ: { symbol: "MT", code: "MZN", rate: 3.5 },
  ZW: { symbol: "ZiG", code: "ZWG", rate: 1.5 },
};

const EUROZONE = ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "PT", "IE", "FI", "GR", "SK", "SI", "LT", "LV", "EE", "CY", "MT", "LU"];

export function useGeoPricing(zarPrice: number): GeoPricing & { localPrice: string; isLocal: boolean } {
  const [geo, setGeo] = useState<GeoPricing>({
    countryCode: "ZA",
    currencySymbol: "R",
    currencyCode: "ZAR",
    exchangeRate: 1,
    isLoading: true,
  });

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const res = await fetch("https://ip-api.com/json/?fields=countryCode", {
          signal: AbortSignal.timeout(3000),
        });
        const data = await res.json();
        const code = data.countryCode || "ZA";
        const currency = CURRENCY_MAP[code] || CURRENCY_MAP["US"];

        setGeo({
          countryCode: code,
          currencySymbol: currency.symbol,
          currencyCode: currency.code,
          exchangeRate: currency.rate,
          isLoading: false,
        });
      } catch {
        setGeo((prev) => ({ ...prev, isLoading: false }));
      }
    };

    detectCountry();
  }, []);

  const convertedAmount = zarPrice * geo.exchangeRate;
  const isLocal = geo.countryCode === "ZA" || geo.currencyCode === "ZAR";

  // Format nicely
  const localPrice = isLocal
    ? `R${zarPrice}`
    : convertedAmount < 1
    ? `${geo.currencySymbol}${convertedAmount.toFixed(2)} ${geo.currencyCode}`
    : convertedAmount >= 100
    ? `${geo.currencySymbol}${Math.round(convertedAmount).toLocaleString()} ${geo.currencyCode}`
    : `${geo.currencySymbol}${convertedAmount.toFixed(2)} ${geo.currencyCode}`;

  return { ...geo, localPrice, isLocal };
}
