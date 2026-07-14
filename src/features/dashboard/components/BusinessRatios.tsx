import { useLanguage } from "@/contexts/LanguageContext";

interface SummaryData {
  totalPurchase: number;
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
}

interface BusinessRatiosProps {
  summary: SummaryData;
}

export default function BusinessRatios({ summary }: BusinessRatiosProps) {
  const { t } = useLanguage();

  const sales = summary.totalSales || 1; // Prevent divide by zero

  // Calculate percentages
  const netProfitMargin = Math.round((summary.netProfit / sales) * 100);
  const overheadRatio = Math.round((summary.totalExpenses / sales) * 100);
  const procurementRatio = Math.round((summary.totalPurchase / sales) * 100);

  // Helper to cap progress bars at 100% and min at 0%
  const clampPercent = (val: number) => Math.max(0, Math.min(100, val));

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
      <h3 className="text-base font-extrabold text-slate-800 mb-5">{t("business_efficiency_ratios")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Net Profit Margin Card */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700">{t("net_profit_margin")}</span>
            <span className={`text-xs font-extrabold ${netProfitMargin >= 15 ? "text-emerald-600" : "text-amber-600"}`}>
              {netProfitMargin}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                netProfitMargin >= 15 ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${clampPercent(netProfitMargin)}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">{t("profitability_measure")}</p>
        </div>

        {/* Overhead Expense Ratio Card */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700">{t("overhead_expense_ratio")}</span>
            <span className="text-xs font-extrabold text-blue-600">
              {overheadRatio}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${clampPercent(overheadRatio)}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">{t("overhead_measure")}</p>
        </div>

        {/* Procurement Cost Ratio Card */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700">{t("procurement_cost_ratio")}</span>
            <span className="text-xs font-extrabold text-indigo-600">
              {procurementRatio}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${clampPercent(procurementRatio)}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">{t("procurement_measure")}</p>
        </div>

      </div>
    </div>
  );
}
