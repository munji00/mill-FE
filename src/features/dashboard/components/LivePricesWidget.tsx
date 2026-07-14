import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LivePricesWidget() {
  const { t } = useLanguage();

  const [livePrices, setLivePrices] = useState([
    { key: "paddy_basmati_1121", basePrice: 3850, price: 3850, trend: "up" },
    { key: "paddy_pusa_1509", basePrice: 3200, price: 3200, trend: "up" },
    { key: "basmati_rice_xl", basePrice: 8200, price: 8200, trend: "down" },
    { key: "sharbati_rice", basePrice: 5450, price: 5450, trend: "up" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices((prev) =>
        prev.map((item) => {
          const change = Math.floor(Math.random() * 21) - 10;
          const newPrice = item.price + change;
          const finalPrice = Math.max(item.basePrice - 150, Math.min(item.basePrice + 150, newPrice));
          return {
            ...item,
            price: finalPrice,
            trend: change >= 0 ? "up" : "down",
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-extrabold text-slate-800">{t("live_market_prices")}</h3>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>
      <div className="space-y-3.5">
        {livePrices.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">{t(item.key)}</span>
            <div className="flex items-center space-x-1.5 font-mono">
              <span className="text-xs font-bold text-slate-900">Rs. {item.price.toLocaleString("en-IN")}</span>
              <span className="text-[9px] text-slate-400">{t("per_quintal")}</span>
              <span className={`text-[10px] ${item.trend === "up" ? "text-emerald-500" : "text-red-500"}`}>
                {item.trend === "up" ? "▲" : "▼"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
