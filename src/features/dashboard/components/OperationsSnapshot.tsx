
import { Layers, Briefcase } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface OperationsSnapshotProps {
  summary: {
    inventoryItemCount: number;
    labourCount: number;
  };
}

export default function OperationsSnapshot({ summary }: OperationsSnapshotProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
      <h3 className="text-base font-extrabold text-slate-800 mb-4">{t("operations_snapshot")}</h3>
      <div className="divide-y divide-slate-100">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
              <Layers size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">{t("inventory_items")}</h4>
              <p className="text-[10px] text-slate-400">{t("stocked_materials_byproducts")}</p>
            </div>
          </div>
          <span className="text-base font-extrabold text-slate-800">{summary.inventoryItemCount}</span>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-50 p-2.5 rounded-lg text-amber-600">
              <Briefcase size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">{t("active_labour_force")}</h4>
              <p className="text-[10px] text-slate-400">{t("operators_loaders_checkers")}</p>
            </div>
          </div>
          <span className="text-base font-extrabold text-slate-800">{summary.labourCount}</span>
        </div>
      </div>
    </div>
  );
}
