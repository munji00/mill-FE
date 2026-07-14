
import { Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ActivityItem {
  id: string;
  type: string;
  msg: string;
  date: string;
}

interface RecentTransactionsProps {
  recentActivities: ActivityItem[];
}

export default function RecentTransactions({ recentActivities }: RecentTransactionsProps) {
  const { t } = useLanguage();

  const renderActivityMsg = (act: ActivityItem) => {
    if (act.type === "Sale") {
      const match = act.msg.match(/Sold (\d+) bags of (.+) for Rs\.(\d+)/i);
      if (match) {
        return t("activity_sold")
          .replace("{quantity}", match[1])
          .replace("{itemName}", match[2])
          .replace("{amount}", Number(match[3]).toLocaleString("en-IN"));
      }
    } else if (act.type === "Purchase") {
      const match = act.msg.match(/Bought (\d+) bags of (.+) for Rs\.(\d+)/i);
      if (match) {
        return t("activity_bought")
          .replace("{quantity}", match[1])
          .replace("{itemName}", match[2])
          .replace("{amount}", Number(match[3]).toLocaleString("en-IN"));
      }
    } else if (act.type === "Expense") {
      const match = act.msg.match(/Paid Rs\.(\d+) for (.+)/i);
      if (match) {
        return t("activity_paid")
          .replace("{amount}", Number(match[1]).toLocaleString("en-IN"))
          .replace("{category}", match[2]);
      }
    }
    return act.msg;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-extrabold text-slate-800">{t("recent_transactions")}</h3>
        <span className="text-xs text-slate-500 font-semibold">{t("latest_5_records")}</span>
      </div>

      <div className="flow-root">
        <ul className="-my-5 divide-y divide-slate-100">
          {recentActivities.map((act) => (
            <li key={act.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    act.type === "Sale"
                      ? "bg-emerald-50 text-emerald-600"
                      : act.type === "Purchase"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  <Activity size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{renderActivityMsg(act)}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{act.date} // Type: {act.type}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
