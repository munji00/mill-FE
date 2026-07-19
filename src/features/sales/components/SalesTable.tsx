import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SalesTableProps {
  filteredRecords: any[];
  isPartner: boolean;
  onEdit: (rec: any) => void;
  onDelete: (id: string) => void;
}

export const SalesTable: React.FC<SalesTableProps> = ({
  filteredRecords,
  isPartner,
  onEdit,
  onDelete,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100/80 overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-center border-collapse min-w-[1150px]" id="sales-table-container">
          <thead>
            <tr className="border-b border-slate-200/60 text-slate-700 text-xs font-extrabold uppercase tracking-wider bg-slate-50/80">
              <th className="px-6 py-4 whitespace-nowrap text-center">{t("date")}</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">{t("item_name")}</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">{t("buyer_name")}</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">{t("quantity")}</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">{t("unit")}</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">{t("price_per_unit")}</th>
              <th className="px-6 py-4 whitespace-nowrap text-center">{t("amount")}</th>
              {!isPartner && <th className="px-6 py-4 text-center whitespace-nowrap">Actions</th>}
            </tr>
          </thead>
          <tbody className="text-sm font-medium text-slate-655">
            {filteredRecords.map((rec, idx) => (
              <tr 
                key={rec.id} 
                className={`hover:bg-slate-100/50 transition-colors border-b border-slate-100/60 ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                }`}
              >
                <td className="px-6 py-4 font-mono text-xs text-slate-500 whitespace-nowrap text-center">
                  {rec.date}
                </td>
                <td className="px-6 py-4 font-sans font-bold text-slate-800 whitespace-nowrap text-center">
                  {rec.itemName}
                </td>
                <td className="px-6 py-4 font-sans text-slate-650 whitespace-nowrap text-center">
                  {rec.buyerName}
                </td>
                <td className="px-6 py-4 font-mono text-slate-700 whitespace-nowrap text-center">
                  {rec.quantity.toLocaleString()}
                </td>
                <td className="px-6 py-4 font-sans text-slate-550 whitespace-nowrap text-center">
                  {rec.unit}
                </td>
                <td className="px-6 py-4 font-mono text-slate-600 whitespace-nowrap text-center">
                  Rs.{rec.pricePerUnit}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-slate-900 whitespace-nowrap text-center">
                  Rs.{rec.totalAmount.toLocaleString("en-IN")}
                </td>
                {!isPartner && (
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => onEdit(rec)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer border border-transparent"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(rec.id)}
                        className="p-1.5 text-slate-400 hover:text-red-655 hover:bg-red-50 rounded-lg transition cursor-pointer border border-transparent"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
