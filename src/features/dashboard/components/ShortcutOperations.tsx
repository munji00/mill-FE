
import { Link } from "react-router-dom";
import { PATHS } from "@/app/router/paths";
import { useLanguage } from "@/contexts/LanguageContext";

interface ShortcutOperationsProps {
  isPartner: boolean;
}

export default function ShortcutOperations({ isPartner }: ShortcutOperationsProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-base font-extrabold text-slate-800 mb-2">{t("shortcut_operations")}</h3>
        <p className="text-xs text-slate-400 mb-6">{t("shortcut_operations_desc")}</p>
        
        <div className="grid grid-cols-2 gap-3">
          <Link
            to={PATHS.PURCHASE}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 hover:border-blue-500/20 hover:bg-blue-50/10 transition text-center cursor-pointer"
          >
            <span className="text-lg mb-1">🛒</span>
            <span className="text-xs font-bold text-slate-700">{t("purchases")}</span>
          </Link>
          <Link
            to={PATHS.SALES}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 hover:border-emerald-500/20 hover:bg-emerald-50/10 transition text-center cursor-pointer"
          >
            <span className="text-lg mb-1">📈</span>
            <span className="text-xs font-bold text-slate-700">{t("sales")}</span>
          </Link>
          <Link
            to={PATHS.EXPENSES}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 hover:border-red-500/20 hover:bg-red-50/10 transition text-center cursor-pointer"
          >
            <span className="text-lg mb-1">💸</span>
            <span className="text-xs font-bold text-slate-700">{t("expenses")}</span>
          </Link>
          <Link
            to={PATHS.INVENTORY}
            className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 hover:border-amber-500/20 hover:bg-amber-50/10 transition text-center cursor-pointer"
          >
            <span className="text-lg mb-1">📦</span>
            <span className="text-xs font-bold text-slate-700">{t("inventory")}</span>
          </Link>
        </div>
      </div>

      <div className="mt-6 text-[10px] text-slate-400 border-t border-slate-100 pt-4 text-center">
        {isPartner ? t("partner_access_view_only") : t("full_admin_controls_enabled")}
      </div>
    </div>
  );
}
